import { Default } from "./default";
import { AccountTypeModel } from "../types/account-type.model";

export interface AccountModel extends Default {
    name: string;
    dueDate: Date;
    paymentDate: Date;
    value: number;
    reference: string;
    userId: any;
    accountType?: AccountTypeModel;
    accountTypeId: any;
}