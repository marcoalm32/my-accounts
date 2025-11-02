import { Default } from "./default";

export interface User extends Default {
    name: string;
    email: string;
    password: string;
}