import { Default } from "./default";

export interface AccountModel extends Default {
    name: string;
    dueDate: Date;
    paymentDate: Date;
    value: number;
    reference: string;
    installment: number;
    userId: any;
}