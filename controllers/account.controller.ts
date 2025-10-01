import { Request, Response } from "express";
import { AccountService } from "../services/account.service";

export class AccountController {

    constructor(private readonly accountService: AccountService) {}

    async find(req: Request, res: Response): Promise<void> {
        try {
            const response = await this.accountService.findAll(req.query);
            res.status(200).json({
                status: 200,
                data: response.data,
                message: 'Contas listadas com sucesso.',
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
            const response = await this.accountService.findById(req.params.id);
            res.status(200).json({
                status: 200,
                data: response.data,
                message: 'Conta encontrada com sucesso.',
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
            const response = await this.accountService.create(req.body);
            res.status(201).json({
                status: 201,
                data: response.data,
                message: 'Conta criada com sucesso.',
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
            const response = await this.accountService.update(req.params.id, req.body);
            res.status(200).json({
                status: 200,
                data: response.data,
                message: 'Conta atualizada com sucesso.',
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
            const response = await this.accountService.delete(req.params.id);
            res.status(200).json({
                status: 200,
                data: response.data,
                message: 'Conta deletada com sucesso.',
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