import { Request, Response } from "express";
import { BalanceService } from "../services/balance.service";

export class BalanceController {

    constructor(
        private readonly balanceService: BalanceService,
    ) {}

    async find(req: Request, res: Response): Promise<void> {

        try {
            const result = await this.balanceService.get(req);
            res.status(result.status).json({
                status: result.status,
                data: result.data,
                message: result.message,
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