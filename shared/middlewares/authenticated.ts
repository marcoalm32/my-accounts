import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

declare global {
    namespace Express {
        interface Request {
            userId?: string;
        }
    }
} 

export const getToken = (req: Request): string | null => {
    const authHeader = req.headers['authorization'];
    if (authHeader && authHeader.startsWith('Bearer ')) {
        return authHeader.split(' ')[1];
    }
    return null;
}

export const getUserById = async (token: string | null): Promise<string | null> => {
    if (!token) return null;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || '') as { id: string };
        return decoded.id;
    } catch (error: any) {
        if (error.name === 'TokenExpiredError') {
            console.log('Token expirado em:', error.expiredAt);
        } else if (error.name === 'JsonWebTokenError') {
            console.log('Token inválido:', error.message);
        } else {
            console.log('Erro na verificação do JWT:', error);
        }
        return null;
    }
}

export const isAuthenticated = async (req: Request, res: Response, next: NextFunction)=> {
    const token = getToken(req);
    if (!token) {
        res.status(401).json({ message: 'Acesso negado! Token não fornecido.' });
        return false;
    }

    const user = await getUserById(token);
    if (!user) {
        res.status(401).json({ message: 'Acesso negado! Token inválido.' });
        return false;
    }

    try {
        req.userId = user.toString();
        next();
    } catch (error) {
        res.status(500).json({ message: 'Token inválido ou expirado.' });
    }
}