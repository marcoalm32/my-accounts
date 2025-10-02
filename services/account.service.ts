import { AbstractCRUD } from '../shared/abstract/abstract-crud';
import { ResponseApi } from '../shared/helpers/response-api';
import { AccountModel } from '../types/account.model';
import { Pagination } from '../types/pagination';

export class AccountService extends AbstractCRUD<AccountModel> {

    create(data: AccountModel): Promise<ResponseApi<AccountModel>> {
        throw new Error('Method not implemented.');
    }

    findById(id: string): Promise<ResponseApi<AccountModel | null>> {
        throw new Error('Method not implemented.');
    }

    findAll(query?: any): Promise<ResponseApi<AccountModel[]>> {
        throw new Error('Method not implemented.');
    }

    update(id: string, data: Partial<AccountModel>): Promise<ResponseApi<AccountModel | null>> {
        throw new Error('Method not implemented.');
    }
    
    delete(id: string): Promise<ResponseApi<boolean>> {
        throw new Error('Method not implemented.');
    }

}