import { Request, Response, NextFunction } from 'express';

export const checkRole = (allowedRoles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {

        if(!req.user){
            return res.status(401).json({message: "Du måste vara inloggad"});
        }

        if(allowedRoles.includes(req.user.role)){
            return next();
        }

        return res.status(403).json({message: "Du har inte behörighet för denna åtgärd"});
    };
};