import { Default } from "./default";

export interface AccountModel extends Default {
    name: string;
    dueDate: Date;
    value: number;
    installment: number;
    totalInstallments: number;
    paid: boolean;
    userId: any;
}