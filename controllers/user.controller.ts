import { UserService } from "../services/user.service";
import { Request, Response } from "express";
import { ResponseApi, responseApi } from "../shared/helpers/response-api";
import { UserModel } from "../types/user.model";

export class UserController {

    private readonly userService: UserService;

    constructor() {
        this.userService = new UserService();
    }

    async register(req: Request, res: Response): Promise<void> {
        try {
            const response = await this.userService.register(req.body);
            res.status(response.status).json(response);
        } catch (error) {
            res.status(500).json({
                status: 500,
                data: null,
                message: 'Erro interno do servidor.',
                pagination: null
            });
        }
    }

    async login(req: Request, res: Response): Promise<void> {
        try {
            const response = await this.userService.login(req.body);
            res.status(response.status).json(response);
        } catch (error) {
            res.status(500).json({
                status: 500,
                data: null,
                message: 'Erro interno do servidor.',
                pagination: null
            });
        }
    }

}