import { ResponseApi } from "../shared/helpers/response-api";
import { ValidateField } from "../shared/helpers/validate-field";
import { User } from "../types/user";
import { UserModel } from '../models/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { UserEnum } from "../types/enum/user.enum";

dotenv.config();

export class UserService {

    async register(data: User): Promise<ResponseApi<User>> {
        const validate = new ValidateField(['name', 'email', 'password', 'confirmPassword'], data, UserEnum);
        const validations = [
            {valid: !validate.requiredField(), message: `${validate.requiredField()} é obrigatório.`},
            {valid: validate.validateEmail('email'), message: 'E-mail inválido.'},
            {valid: validate.validatePassword(8), message: 'A senha deve conter no mínimo 8 caracteres e, pelo menos, um número.'},
            {valid: validate.comparePasswords(), message: 'As senhas não coincidem.'}
        ];

        for (const item of validations) {
            if (!item.valid) {
                return {
                    status: 422,
                    data: null,
                    message: item.message,
                };
            }
        }

        const hashPassword = await bcrypt.hash(data.password, 12);
        const existingUser = await UserModel.findOne({ email: data.email });
        if (existingUser) {
            return {
                status: 409,
                data: null,
                message: 'Usuário já cadastrado.',
            };
        }

        const user = {
            name: data.name,
            email: data.email,
            password: hashPassword
        }

        try {
            const newUser = await UserModel.create(user);
            return {
                status: 201,
                data: {name: newUser.name, email: newUser.email, id: newUser.id} as User,
                message: 'Usuário criado com sucesso.',
            };
        } catch (error) {
            return {
                status: 500,
                data: null,
                message: 'Erro ao criar o usuário.',
            };
        }
    }

    async login(data: User): Promise<ResponseApi<User>> {
        const validate = new ValidateField(['email', 'password'], data, UserEnum);
        const validations = [
            {valid: !validate.requiredField(), message: `${validate.requiredField()} é obrigatório.`},
            {valid: validate.validateEmail('email'), message: 'E-mail inválido.'},
            {valid: validate.validatePassword(8), message: 'A senha deve conter no mínimo 8 caracteres e, pelo menos, um número.'},
        ];

        for (const item of validations) {
            if (!item.valid) {
                return {
                    status: 422,
                    data: null,
                    message: item.message,
                };
            }
        }

        const user = await UserModel.findOne({ email: data.email });
        if (!user) {
            return {
                status: 404,
                data: null,
                message: 'Usuário não encontrado.',
            };
        }

        const match = await bcrypt.compare(data.password, user.password);
        if (!match) {
            return {
                status: 401,
                data: null,
                message: 'Senha inválida.',
            };
        }

        try {
            const token = jwt.sign(
                { id: user._id },
                process.env.JWT_SECRET as string,
                { expiresIn: '3h' }
            );

            return {
                data: {
                    name: user.name,
                    email: user.email,
                } as User,
                token,
                status: 200,
                message: 'Login realizado com sucesso.',
            };

        } catch (error) {
            return {
                status: 500,
                data: null,
                message: 'Erro ao gerar o token.',
            };
        }

        

    }

}