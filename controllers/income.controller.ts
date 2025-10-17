import { Request, Response } from 'express';
import { IncomeService } from '../services/income.service';

export class IncomeController {

    constructor(private readonly incomeService: IncomeService) {}

    async create(req: Request, res: Response): Promise<void> {
        try {
            const response = await this.incomeService.create(req.body, req);
            res.status(response.status).json({
                status: response.status,
                data: response.data,
                message: response.message,
            });
        } catch (error) {
            res.status(500).json({
                status: 500,
                data: null,
                message: 'Erro interno do servidor.',
            });
        }
    }

    async find(req: Request, res: Response): Promise<void> {
        try {
            const response = await this.incomeService.findAll(req);
            res.status(response.status).json({
                status: response.status,
                data: response.data,
                message: response.message,
                pagination: response.pagination
            });
        } catch (error) {
            res.status(500).json({
                status: 500,
                data: null,
                message: 'Erro interno do servidor.',
            });
        }
    }

    async findById(req: Request, res: Response): Promise<void> {
        try {
            const response = await this.incomeService.findById(req);
            res.status(response.status).json({
                status: response.status,
                data: response.data,
                message: response.message,
            });
        } catch (error) {
            res.status(500).json({
                status: 500,
                data: null,
                message: 'Erro interno do servidor.',
            });
        }
    }

    async update(req: Request, res: Response): Promise<void> {
        try {
            const response = await this.incomeService.update(req.body, req);
            res.status(response.status).json({
                status: response.status,
                data: response.data,
                message: response.message,
            });
        } catch (error) {
            res.status(500).json({
                status: 500,
                data: null,
                message: 'Erro interno do servidor.',
            });
        }
    }

    async delete(req: Request, res: Response): Promise<void> {
        try {
            const response = await this.incomeService.delete(req);
            res.status(response.status).json({
                status: response.status,
                data: response.data,
                message: response.message,
            });
        } catch (error) {
            res.status(500).json({
                status: 500,
                data: null,
                message: 'Erro interno do servidor.',
            });
        }
    }
}