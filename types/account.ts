import { Default } from "./default";
import { AccountType } from "./account-type";

export interface Account extends Default {
    name: string;
    dueDate: Date;
    paymentDate: Date;
    value: number;
    reference: string;
    userId: any;
    accountType?: AccountType;
    accountTypeId: any;
}