import {  Income } from '../types/income';
import { Request } from 'express';
import { AbstractCRUD } from '../shared/abstract/abstract-crud';
import { ResponseApi } from '../shared/helpers/response-api';
import { ValidateField } from '../shared/helpers/validate-field';
import { IncomeEnum } from '../types/enum/income.enum';
import { IncomeModel } from '../models/Income';

export class IncomeService extends AbstractCRUD<Income> {

    async create(data: Income, req: Request): Promise<ResponseApi<Income>> {
        
        const dto = await this.createDto(data, req);
        if (dto.status !== 200 || !dto.data) {
            return dto;
        }

        try {
            const newIncome = new IncomeModel({
                ...dto.data,
                userId: dto.data.userId,
            });
            const savedIncome = await newIncome.save();
            return {
                status: 201,
                data: savedIncome as Income,
                message: 'Receita criada com sucesso.',
            }
        } catch (error) {
            return {
                status: 500,
                data: null,
                message: 'Erro interno do servidor.',
            };
        }
    }

    async findById(req: Request): Promise<ResponseApi<Income | null>> {
        
        const id = req.params.id;
        const userId = await this.getUser(req);
        if (!userId) {
            return {
                status: 401,
                data: null,
                message: 'Usuário não autenticado.',
            }
        }

        try {
            const income = await IncomeModel.findOne({ _id: id, userId: userId });
            return {
                status: income ? 200 : 404,
                data: income as Income,
                message: income ? 'Receita encontrada com sucesso.' : 'Receita não encontrada.',
            }
        } catch (error) {
            return {
                status: 500,
                data: null,
                message: 'Erro interno do servidor.',
            };
        }

    }

    async findAll(req: Request): Promise<ResponseApi<Income[]>> {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const query = this.buildQueries(req.query);
        const userId = await this.getUser(req);

        const skip = (page - 1) * limit;
        try {
            const incomes = await IncomeModel.find({ userId, ...query.filter })
                .skip(skip)
                .limit(limit)
                .exec();
            const total = await IncomeModel.countDocuments({ userId, ...query.filter });
            return {
                status: 200,
                data: incomes as Income[],
                message: 'Receitas encontradas com sucesso.',
                pagination: this.setPagination(total, limit, skip)
            }
        } catch (error) {
            return {
                status: 500,
                data: null,
                message: 'Erro interno do servidor.',
            };
        }
    }


    async update(data: Income, req: Request): Promise<ResponseApi<Income | null>> {
        const id = req.params.id;
        const dto = await this.createDto(data, req);
        if (dto.status !== 200 || !dto.data) {
            return dto;
        }

        try {
            const updatedIncome = await IncomeModel.findByIdAndUpdate(
                { _id: id, userId: dto.data.userId },
                dto.data,
                { new: true }
            );
            return {
                status: updatedIncome ? 200 : 404,
                data: updatedIncome as Income,
                message: updatedIncome ? 'Receita atualizada com sucesso.' : 'Receita não encontrada.',
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
        const userId = await this.getUser(req);

        if (!userId) {
            return {
                status: 401,
                data: null,
                message: 'Usuário não autenticado.',
            }
        }

        try {
            const income = await IncomeModel.findOneAndDelete({ _id: id, userId: userId });
            return {
                status: income ? 200 : 404,
                data: income ? true : false,
                message: income ? 'Receita deletada com sucesso.' : 'Receita não encontrada.',
            }
        } catch (error) {
            return {
                status: 500,
                data: null,
                message: 'Erro interno do servidor.',
            };
        }
    }

    private async createDto(data: Income, req: Request): Promise<ResponseApi<Income>> {

        const validate = new ValidateField<Income>(
            ['name', 'value', 'receivedDate'],
            data,
            IncomeEnum
        );
        const missingField = validate.requiredField();
        if (missingField) {
            return {
                status: 400,
                data: null,
                message: `O campo ${missingField} é obrigatório.`,
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

        const newData: Income = {
            ...data,
            userId: userId,
        };

        return {
            status: 200,
            data: newData,
            message: 'Dados validados com sucesso.',
        };
    }
    

    
}