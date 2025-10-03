import { Request, Response } from "express";
import { ResponseApi } from "../../shared/helpers/response-api";
import { getToken, getUserById } from "../middlewares/authenticated";

export abstract class AbstractCRUD<T> {

    abstract create(data: T, req?: Request): Promise<ResponseApi<T>>;
    abstract findById(req: Request): Promise<ResponseApi<T | null>>;
    abstract findAll(req: Request): Promise<ResponseApi<T[]>>;
    abstract update(data: T, req: Request): Promise<ResponseApi<T | null>>;
    abstract delete(req: Request): Promise<ResponseApi<boolean>>;

    async getUser(req: Request) {
        const token = getToken (req);
        const userId = await getUserById(token);
        return userId;
    }
    
}