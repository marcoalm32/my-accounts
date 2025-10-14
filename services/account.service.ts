import { AbstractCRUD } from '../shared/abstract/abstract-crud';
import { ResponseApi } from '../shared/helpers/response-api';
import { AccountModel } from '../types/account.model';
import { Account } from '../models/Account';
import { AccountEnum } from '../types/enum/account.enum';
import { ValidateField } from '../shared/helpers/validate-field';
import { getToken, getUserById } from '../shared/middlewares/authenticated';
import { Request } from 'express';
import { AccountType } from '../models/AccountType';
import moment from 'moment';

export class AccountService extends AbstractCRUD<AccountModel> {

    async create(data: AccountModel, req: Request): Promise<any> {
        const dto = await this.createDto(data, req);
        if (dto.status !== 200 || !dto.data) {
            return dto;
        }
        try {
            const newAccount = new Account({
                ...dto.data,
                userId: dto.data.userId,
                accountType: dto.data.accountType,
            });
            const savedAccount = await newAccount.save();
            return {
                status: 201,
                data: savedAccount as AccountModel,
                message: 'Conta criada com sucesso.',
            }
        } catch (error) {
            return {
                status: 500,
                data: null,
                message: 'Erro interno do servidor.',
            };
        }
    }

    async findById(req: Request): Promise<ResponseApi<AccountModel | null>> {
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
            const account = await Account.findOne({ _id: id, userId: userId });
            return {
                status: account ? 200 : 404,
                data: account as AccountModel,
                message: account ? 'Conta encontrada com sucesso.' : 'Conta não encontrada.',
            }
        } catch (error) {
            return {
                status: 500,
                data: null,
                message: 'Erro interno do servidor.',
            };
        }
    }

    async findAll(req: Request): Promise<ResponseApi<AccountModel[]>> {
        const page = Number(req.query.page) || 0;
        const limit = Number(req.query.limit) || 10;
        const query = this.buildQueries(req.query);
        const token = getToken(req);
        const userId = await getUserById(token);
        
        const skip = (page - 1) * limit;
        try {
            const accounts = await Account.find({ userId, ...query.filter })
                .skip(skip)
                .limit(limit)
                .exec();
            const total = await Account.countDocuments({ userId, ...query.filter });

            return {
                status: 200,
                data: accounts as AccountModel[],
                message: 'Contas listadas com sucesso.',
                pagination: this.setPagination(total, limit, skip)
            }

        } catch (error) {
            return {
                status: 500,
                data: null,
                message: 'Erro interno do servidor.',
                pagination: null,
            }
        }

    }

    async update(data: AccountModel, req: Request): Promise<ResponseApi<AccountModel | null>> {
        const id = req.params.id;
        const dto = await this.createDto(data, req);
        if (dto.status !== 200 || !dto.data) {
            return dto;
        }
        try {
            const updatedAccount = await Account.findOneAndUpdate(
                { _id: id, userId: dto.data?.userId },
                dto.data,
                { new: true }
            );
            return {
                status: updatedAccount ? 200 : 404,
                data: updatedAccount as AccountModel,
                message: updatedAccount ? 'Conta atualizada com sucesso.' : 'Conta não encontrada.',
            }
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
        const userId = await this.getUser(req)
        if (!userId) return {
            status: 401,
            data: false,
            message: 'Usuário não autenticado.',
        };
        try {
        const result = await Account.findOneAndDelete({ _id: id, userId});
            return {
                status: result ? 200 : 404,
                data: result ? true : false,
                message: result ? 'Conta deletada com sucesso.' : 'Conta não encontrada.',
            }
        } catch (error) {
            return {
                status: 500,
                data: false,
                message: 'Erro interno do servidor.',
            };
        }
    }

    private async createDto(data: AccountModel, req: Request): Promise<ResponseApi<any>> {
        const validate = new ValidateField([
            'name', 
            'dueDate',
            'value',
            'reference',
            'accountTypeId'
        ], data, AccountEnum);
        const validations = [
            {valid: !validate.requiredField(), message: `${validate.requiredField()} é obrigatório.`},
            {valid: validate.validateDate('MMMM/YYYY', data.reference), message: `Referência inválida. Use o formato "mês/ano".`},
        ];

        for (const v of validations) {
            if (!v.valid) {
                return {
                    status: 422,
                    data: null,
                    message: v.message,
                }
            }
        }

        const userId = await this.getUser(req);
        if (!userId) {
            return {
                status: 401,
                data: null,
                message: 'Usuário não autenticado.',
            }
        }

        const accountType = await AccountType.findOne({ _id: data.accountTypeId, userId });
        if (!accountType) {
            return {
                status: 404,
                data: null,
                message: 'Tipo de conta não encontrado.',
            }
        }
        const formattedReference = moment(data.reference, 'MMMM/YYYY').format('YYYY-MM');
        data.reference = formattedReference;
        const newData = {
            ...data,
            userId,
            accountType,
        }
        return {
            data: newData,
            status: 200,
            message: 'Dados válidos.',
        }
    }

}