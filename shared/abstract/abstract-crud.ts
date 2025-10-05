import { Request, Response } from "express";
import { ResponseApi } from "../../shared/helpers/response-api";
import { getToken, getUserById } from "../middlewares/authenticated";
import { Pagination } from "../../types/pagination";
import moment from "moment";

export abstract class AbstractCRUD<T> {

    abstract create(data: T, req?: Request): Promise<ResponseApi<T>>;
    abstract findById(req: Request): Promise<ResponseApi<T | null>>;
    abstract findAll(req: Request): Promise<ResponseApi<T[]>>;
    abstract update(data: T, req: Request): Promise<ResponseApi<T | null>>;
    abstract delete(req: Request): Promise<ResponseApi<boolean>>;

    protected async getUser(req: Request) {
        const token = getToken(req);
        const userId = await getUserById(token);
        return userId;
    }

    protected setPagination(total: number, limit: number, skip: number): Pagination {
        return {
            totalPages: Math.ceil(total / limit),
            totalItems: total,
            limit: limit,
            page: Math.floor(skip / limit) + 1,
        };
    }

    protected buildQueries(query: any): any {
        const filter: any = {};
        if (query.search) {
            filter.name = { $regex: query.search, $options: 'i' };
        }
        if (Object.keys(query).some(key => key.toLowerCase().includes('date'))) {
            const startDate = moment(query?.dateFrom).format('YYYY-MM') || moment().format('YYYY-MM');
            const endDate = moment(query?.dateTo).format('YYYY-MM') || moment().format('YYYY-MM');
            filter.reference = { $gte: startDate, $lte: endDate };
        }

        return { filter };
    }
    
}