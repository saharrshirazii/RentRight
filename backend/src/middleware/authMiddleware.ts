import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                role: 'guest' | 'host' | 'admin';
            };
        }
    }
}

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {

    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if(!token){
        return res.status(401).json({message: "Ingen token hittades, åtkomst nekad"});
    }

    if (!process.env.JWT_SECRET) {
    throw new Error("SERVER_ERROR: JWT_SECRET är inte konfigurerad i .env");
    }

    try {
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET) as {id:string, role: 'guest' | 'host' | 'admin'};

        req.user= decoded;

        next();
    }

    catch(error:any) {
        if(error.name === 'TokenExpiredError'){
            return res.status(401).json({message: "Sessionen har gått ut, vänligen logga in igen"});
        }
        return res.status(403).json({message: "Ogiltig token"});
    }
};