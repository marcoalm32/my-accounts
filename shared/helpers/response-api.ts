import { Pagination } from "../../types/pagination"

export interface ResponseApi<T> {
    status: number;
    message: string;
    data: T | null;
    pagination?: Pagination | null;
    token?: string;
}

export const responseApi = <T>(
    status: number, data: T | null, 
    message: string = '', 
    pagination: Pagination | null = null,
    token?: string
): ResponseApi<T> => {
    return {
        message: message,
        status: status,
        data: data,
        ...(pagination && {pagination}),
        ...(token && { token })
    }
}