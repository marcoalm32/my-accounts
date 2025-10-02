import { ResponseApi } from "../../shared/helpers/response-api";

export abstract class AbstractCRUD<T> {

    abstract create(data: T): Promise<ResponseApi<T>>;
    abstract findById(id: string): Promise<ResponseApi<T | null>>;
    abstract findAll(query?: any): Promise<ResponseApi<T[]>>;
    abstract update(id: string, data: Partial<T>): Promise<ResponseApi<T | null>>;
    abstract delete(id: string): Promise<ResponseApi<boolean>>;
    
}