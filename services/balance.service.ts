import { BalanceModel } from "../types/balance.model";
import { ResponseApi } from "../shared/helpers/response-api";
import { Request } from "express";
import { getToken, getUserById } from "../shared/middlewares/authenticated";
import { Income } from "../models/Income";
import { Account } from "../models/Account";
import { Types } from "mongoose";

export class BalanceService {

    async get(req: Request): Promise<ResponseApi<BalanceModel | null>> {
        const token = getToken(req);
        const userId = await getUserById(token);

        const dateFrom: string = typeof req.query.dateFrom === 'string' ? req.query.dateFrom : '';
        const dateTo: string = typeof req.query.dateTo === 'string' ? req.query.dateTo : '';

        if (!userId) {
            return {
                status: 401,
                data: null,
                message: 'Usuário não autenticado.',
            }
        }

        try {
            const totalIncome = await this.calculateTotalIncome(
                userId,
                dateFrom,
                dateTo,
            );

            const totalAccounts = await this.calculateTotalAccounts(
                userId,
                dateFrom,
                dateTo,
            );

            const balance: BalanceModel = {
                totalIncome,
                totalAccounts,
                dateFrom: new Date(dateFrom),
                dateTo: new Date(),
                value: Number((totalIncome - totalAccounts).toFixed(2)),
                userId: userId,
            };

            return {
                status: 200,
                data: balance,
                message: 'Balanço obtido com sucesso.',
            }
        } catch (error) {
            return {
                status: 500,
                data: null,
                message: 'Erro interno do servidor.',
            };
        }
    }

    private async calculateTotalIncome(userId: any, dateFrom?: string, dateTo?: string): Promise<number> {
        const objectUserId = Types.ObjectId.createFromHexString(userId);
        const income = await Income.aggregate([
            {
                $match: {
                    userId: objectUserId,
                    receivedDate: {
                        $gte: dateFrom ? new Date(dateFrom) : new Date(0),
                        $lte: dateTo ? new Date(dateTo) : new Date(),
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    totalIncome: { $sum: "$value" },
                }
            }
        ]);

        return income.length > 0 ? income[0].totalIncome : 0;
    }

    private async calculateTotalAccounts(userId: any, dateFrom?: string, dateTo?: string): Promise<number> {
        const objectUserId = Types.ObjectId.createFromHexString(userId);
        const accountsCount = await Account.aggregate([
            {
                $match: {
                    userId: objectUserId,
                    paymentDate: {
                        $gte: dateFrom ? new Date(dateFrom) : new Date(0),
                        $lte: dateTo ? new Date(dateTo) : new Date(),
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    totalAccounts: { $sum: '$value' }
                }
            }
        ]);

        return accountsCount.length > 0 ? accountsCount[0].totalAccounts : 0;
    }
}