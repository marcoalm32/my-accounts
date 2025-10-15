import { Request } from 'express';
import { AbstractCRUD } from '../shared/abstract/abstract-crud';
import { ResponseApi } from '../shared/helpers/response-api';
import { AccountTypeModel } from '../types/account-type.model';
import { AccountTypeEnum } from '../types/enum/account-type.enum';
import { ValidateField } from '../shared/helpers/validate-field';
import { getToken, getUserById } from '../shared/middlewares/authenticated';
import { AccountType } from '../models/AccountType';

export class AccountTypeService extends AbstractCRUD<AccountTypeModel> {
    
    async create(data: AccountTypeModel, req: Request): Promise<ResponseApi<AccountTypeModel>> {
        const validate = new ValidateField(['name'], data, AccountTypeEnum);
        const missingField = validate.requiredField();
        if (missingField) {
            return {
                status: 422,
                data: null,
                message: `${missingField} é obrigatório.`,
            };
        }
        const token = getToken(req);
        const userId = await getUserById(token);
        if (!userId) {
            return {
                status: 401,
                data: null,
                message: 'Usuário não autenticado.',
            };
        }
        try {
            const accountType = new AccountType({
                ...data,
                userId: userId,
            });
            const newAccountType = await accountType.save();
            return {
                status: 201,
                data: newAccountType as AccountTypeModel,
                message: 'Tipo de conta criada com sucesso.',
            };

        } catch (error) {
            return {
                status: 500,
                data: null,
                message: 'Erro interno do servidor.',
            };
        }
        
    }

    async findById(req: Request): Promise<ResponseApi<AccountTypeModel | null>> {
        const id = req.params.id;
        const token = getToken(req);
        const userId = await getUserById(token);

        if (!userId) {
            return {
                status: 401,
                data: null,
                message: 'Usuário não autenticado.',
            };
        }

        try {
            const accountType = await AccountType.findOne({ _id: id, userId: userId });
            return {
                status: accountType ? 200 : 404,
                data: accountType as AccountTypeModel,
                message: accountType ? 'Tipo de conta encontrado com sucesso.' : 'Tipo de conta não encontrado.',
            };
        } catch (error) {
            return {
                status: 500,
                data: null,
                message: 'Erro interno do servidor.',
            };
        }
    }

    async findAll(req: Request): Promise<ResponseApi<AccountTypeModel[]>> {
        const page = parseInt(req.query.page as string) || 1;
        const query = this.buildQueries(req.query);
        const limit = parseInt(req.query.limit as string) || 10;
        const token = getToken(req);
        const userId = await getUserById(token);

        const skip = (page - 1) * limit;
        try {
            const accountTypes = await AccountType.find({ userId, ...query.filter })
                .skip(skip)
                .limit(limit)
                .exec();
            const total = await AccountType.countDocuments({ userId, ...query.filter });
            return {
                status: 200,
                data: accountTypes as AccountTypeModel[],
                message: 'Tipos de conta encontrados com sucesso.',
                pagination: this.setPagination(total, limit, skip),
            };
        } catch (error) {
            return {
                status: 500,
                data: null,
                message: 'Erro interno do servidor.',
            };
        }
    }

    async update(data: AccountTypeModel, req: Request): Promise<ResponseApi<AccountTypeModel | null>> {
        const id = req.params.id;
        const validate = new ValidateField(['name'], data, AccountTypeEnum);
        if (!validate.requiredField()) {
            return {
                status: 422,
                data: null,
                message: `${validate.requiredField()} é obrigatório.`,
            };
        }
        const token = getToken(req);
        const userId = await getUserById(token);
        if (!userId) {
            return {
                status: 401,
                data: null,
                message: 'Usuário não autenticado.',
            };
        }

        try {
            const updatedAccountType = await AccountType.findOneAndUpdate(
                { _id: id, userId },
                { $set: data },
                { new: true }
            );
            return {
                status: updatedAccountType ? 200 : 404,
                data: updatedAccountType,
                message: updatedAccountType ? 'Tipo de conta atualizado com sucesso.' : 'Tipo de conta não encontrado.',
            };
        } catch (error) {
            return {
                status: 500,
                data: null,
                message: 'Erro interno do servidor.',
            };
        }
    }

    async delete(req: Request): Promise<ResponseApi<boolean>> {
        const id = req.params.id;
        const token = getToken(req);
        const userId = await getUserById(token);

        if (!userId) {
            return {
                status: 401,
                data: null,
                message: 'Usuário não autenticado.',
            }
        }

        try {
            const accountType = await AccountType.findOneAndDelete({ _id: id, userId });
            return {
                status: accountType ? 200 : 404,
                data: accountType ? true : false,
                message: accountType ? 'Tipo de conta deletado com sucesso.' : 'Tipo de conta não encontrado.',
            }
        } catch (error) {
            return {
                status: 500,
                data: false,
                message: 'Erro interno do servidor.',
            };
        }
    }

    
}