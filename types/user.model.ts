import { Default } from "./default";

export interface UserModel extends Default {
    name: string;
    email: string;
    password: string;
}