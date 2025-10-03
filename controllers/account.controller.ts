import { Request, Response } from "express";
import { AccountService } from "../services/account.service";

export class AccountController {

    constructor(private readonly accountService: AccountService) {}

    async find(req: Request, res: Response): Promise<void> {
        try {
            const response = await this.accountService.findAll(req);
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
            const response = await this.accountService.findById(req);
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

    async create(req: Request, res: Response) {
        try {
            const response = await this.accountService.create(req.body, req);
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

    async update(req: Request, res: Response) {
        try {
            const response = await this.accountService.update(req.body, req);
            res.status(200).json({
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

    async delete(req: Request, res: Response) {
        try {
            const response = await this.accountService.delete(req);
            res.status(200).json({
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