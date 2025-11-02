import { Default } from "./default";

export interface Income extends Default {
    name: string;
    receivedDate: Date;
    value: number;
    userId: any;
}