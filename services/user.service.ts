import { ResponseApi } from "../shared/helpers/response-api";
import { ValidateField } from "../shared/helpers/validate-field";
import { UserModel } from "../types/user.model";
import { User } from '../models/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export class UserService {

    async register(data: UserModel): Promise<ResponseApi<UserModel>> {
        const validate = new ValidateField(['name', 'email', 'password'], data);
        const missingField = validate.requiredField();
        if (missingField) {
            return {
                status: 422,
                data: null,
                message: `${missingField} é obrigatório.`,
                pagination: null
            };
        }

        if (!validate.validateEmail('email')) {
            return {
                status: 422,
                data: null,
                message: 'E-mail inválido.',
                pagination: null
            };
        }

        if (!validate.validatePassword(8)) {
            return {
                status: 422,
                data: null,
                message: 'A senha deve conter no mínimo 8 caracteres e, pelo menos, um número.',
                pagination: null
            };
        }

        const hashPassword = await bcrypt.hash(data.password, 10);

        const user = {
            name: data.name,
            email: data.email,
            password: hashPassword
        }

        try {
            const newUser = await User.create(user);
            newUser.password = '';
            return {
                status: 201,
                data: newUser,
                message: 'Usuário criado com sucesso.',
                pagination: null
            };
        } catch (error) {
            return {
                status: 500,
                data: null,
                message: 'Erro ao criar o usuário.',
                pagination: null
            };
        }
    }

    async login(data: UserModel): Promise<ResponseApi<UserModel>> {
        const validate = new ValidateField(['email', 'password'], data);
        const missingField = validate.requiredField();
        if (missingField) {
            return {
                status: 422,
                data: null,
                message: `${missingField} é obrigatório.`,
                pagination: null
            };
        }

        if (!validate.validateEmail('email')) {
            return {
                status: 422,
                data: null,
                message: 'E-mail inválido.',
                pagination: null
            };
        }

        const user = await User.findOne({ email: data.email });
        if (!user) {
            return {
                status: 404,
                data: null,
                message: 'Usuário não encontrado.',
                pagination: null
            };
        }

        const match = await bcrypt.compare(data.password, user.password);
        if (!match) {
            return {
                status: 401,
                data: null,
                message: 'Senha inválida.',
                pagination: null
            };
        }

        try {
            const token = jwt.sign(
                { id: user._id },
                process.env.JWT_SECRET as string,
                { expiresIn: '1h' }
            );

            user.password = '';
            return {
                data: null,
                token,
                status: 200,
                message: 'Login realizado com sucesso.',
                pagination: null
            };

        } catch (error) {
            return {
                status: 500,
                data: null,
                message: 'Erro ao gerar o token.',
                pagination: null
            };
        }

        

    }

}