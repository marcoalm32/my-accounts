import { Balance } from "../types/balance";
import { ResponseApi } from "../shared/helpers/response-api";
import { Request } from "express";
import { getToken, getUserById } from "../shared/middlewares/authenticated";
import { IncomeModel } from "../models/Income";
import { AccountModel } from "../models/Account.model";
import { LatestTransactions } from '../types/latest-transactions';
import { Types } from "mongoose";

export class BalanceService {

    async find(req: Request): Promise<ResponseApi<Balance | null>> {
        const userId = await this.getUser(req).then(res => res);
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

            const balance: Balance = {
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

    async findLatest(req: Request): Promise<ResponseApi<LatestTransactions[] | []>> {
        const userId = await this.getUser(req).then(res => res);

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
            const latestTransactions = await this.getLatestTransactions(
                userId,
                dateFrom,
                dateTo,
            );

            return {
                status: 200,
                data: latestTransactions,
                message: 'Transações mais recentes obtidas com sucesso.'
            }
        } catch (error) {
            return {
                status: 500,
                data: null,
                message: 'Erro interno do servidor.',
            };
        }
    }

    async findAccountBalance(req: Request): Promise<ResponseApi<LatestTransactions[] | null>> {
        const userId = await this.getUser(req).then(res => res);
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
            const objectUserId = Types.ObjectId.createFromHexString(userId);
            const accountBalance = await AccountModel.aggregate([
                {
                    $match: {
                        userId: objectUserId,
                        paymentDate: {
                            $exists: true,
                            $ne: null,
                            $gte: dateFrom ? new Date(dateFrom) : new Date(0),
                            $lte: dateTo ? new Date(dateTo) : new Date(),
                        }
                    }
                },
                {
                    $group: {
                        _id: "$name",
                        value: { $sum: '$value' },
                        date: { $max: "$paymentDate" },
                        name: { $first: '$name' },
                    }
                },
                { $sort: { date: -1 } },
                { $limit: 5 }
            ]);

            return {
                status: 200,
                data: accountBalance,
                message: 'Saldo de contas obtido com sucesso.'
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

        try {
            const income = await IncomeModel.aggregate([
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
        } catch (error) {
            return 0
        }
    }

    private async calculateTotalAccounts(userId: any, dateFrom?: string, dateTo?: string): Promise<number> {
        const objectUserId = Types.ObjectId.createFromHexString(userId);

        try {
            const accountsCount = await AccountModel.aggregate([
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
        } catch (error) {
            return 0;
        }

    }

    private async getLatestTransactions(userId: any, dateFrom?: string, dateTo?: string): Promise<LatestTransactions[]> {
        try {
            const accounts = await AccountModel.find({
                userId,
                paymentDate: {
                    $gte: dateFrom ? new Date(dateFrom) : new Date(0),
                    $lte: dateTo ? new Date(dateTo) : new Date(),
                }
            }).sort({ paymentDate: -1 }).limit(3);

            const incomes = await IncomeModel.find({
                userId,
                receivedDate: {
                    $gte: dateFrom ? new Date(dateFrom) : new Date(0),
                    $lte: dateTo ? new Date(dateTo) : new Date(),
                }
            }).sort({ receivedDate: -1 }).limit(3);

            const latestTransactions: LatestTransactions[] =
                [...accounts, ...incomes].reduce<LatestTransactions[]>((acc, item) => {
                    const isAccount = 'paymentDate' in item;
                    acc.push({
                        name: item.name,
                        value: item.value,
                        date: isAccount ? item.paymentDate : item.receivedDate,
                        type: isAccount ? 'account' : 'income',
                    });
                    return acc;
                }, [])
                    .sort((a, b) => b.date.getTime() - a.date.getTime())
                    .slice(0, 4);

            return [
                ...latestTransactions
            ];
        } catch (error) {
            return [];
        }
    }

    private async getUser(req: Request) {
        const token = getToken(req);
        const userId = await getUserById(token);
        return userId;
    }

}