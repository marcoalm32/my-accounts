import { Default } from "./default";

export interface IncomeModel extends Default {
    name: string;
    receivedDate: Date;
    value: number;
    userId: any;
}