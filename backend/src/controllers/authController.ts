import { Request, Response } from 'express';
import User from '../models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { registerSchema, loginSchema, changepasswordSchema } from '../validators/authValidator';
import { logger } from '../logger/logger';

const createToken = (id: string, role: string) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET as string, { expiresIn: '1h' });
};

export const register = async (req: Request, res: Response) => {
    try {
        // Validera direkt. Om det misslyckas hoppar den till catch-blocket
        const data = registerSchema.parse(req.body);

        const user = await User.create(data);
        const token = createToken(user._id.toString(), user.role);

        //INFO LOG: High-value milestone tracking
        logger.info({ userId: user._id, email: user.email, role: user.role }, 'Ny användare har registrerats');

        res.status(201).json({
            token,
            user: { id: user._id.toString(), name: user.name, email: user.email, role: user.role }
        });
    } catch (error: any) {
        if (error.name === 'ZodError') {
            // WARN LOG: Input validation errors are client-side issues, not server crashes
            logger.warn({ issues: error.issues }, 'Användarregistrering misslyckades - Zod-valideringsfel');
            return res.status(400).json({ message: error.issues[0].message });
        }
        //ERROR LOG: Catch-all for database issues or unexpected exceptions
        logger.error({ err: error.message, stack: error.stack }, 'Kritiskt fel under användarregistrering');
        res.status(400).json({ message: "Registrering misslyckades" });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = loginSchema.parse(req.body);
        const user = await User.findOne({ email });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            //SECURITY WARN LOG: Tracking invalid authentication attempts is crucial
            logger.warn({ attemptedEmail: email }, 'Misslyckad inloggning - Ogiltiga inloggningsuppgifter');
            return res.status(401).json({ message: "Fel e-post eller lösenord" });
        }

        const token = createToken(user._id.toString(), user.role);
        //INFO LOG: Track successful authentications
        logger.info({ userId: user._id, email: user.email }, 'Användaren har loggat in');
        res.status(200).json({
            token,
            user: { id: user._id.toString(), name: user.name, email: user.email, role: user.role }
        });
    } catch (error: any) {
        //ERROR LOG
        logger.error({ err: error.message }, 'Oväntat fel under inloggningsprocessen');
        res.status(401).json({ message: "Inloggning misslyckades" });
    }
};

export const switchRole = async (req: any, res: Response) => {
    try {
        const user = await User.findById(req.user!.id);
        if (!user) {
            //WARN LOG
            logger.warn({ userId: req.user!.id }, 'Rollbyte misslyckades - Användaren hittades inte');
            return res.status(404).json({ message: "Hittades ej" });
        }
        
        const oldRole = user.role;

        user.role = user.role === 'guest' ? 'host' : 'guest';
        await user.save();
        //INFO LOG: Track ecosystem switches (very helpful to track user behavior)
        logger.info({ userId: user._id, from: oldRole, to: user.role }, 'Användaren bytte instrumentpanelsroller');
        return res.status(200).json({ id: user._id, name: user.name, email: user.email, role: user.role });
    } catch (error: any) {
        //ERROR LOG
        logger.error({ userId: req.user?.id, err: error.message }, 'Fel i switchRole-kontrollen');
        return res.status(500).json({ message: "Serverfel" });
    }
};

export const changePassword = async (req: any, res: Response) => {
    try {
        const { currentPassword, newPassword } = changepasswordSchema.parse(req.body);
        const user = await User.findById(req.user!.id);

        if (!user || !(await bcrypt.compare(currentPassword, user.password))) {
            //WARN LOG
            logger.warn({ userId: req.user?.id }, 'Misslyckad lösenordsändring - Felaktigt lösenord');
            return res.status(401).json({ message: "Fel lösenord" });
        }

        user.password = newPassword;
        await user.save();
        //INFO LOG
        logger.info({ userId: user._id }, 'Användaren har ändrat sitt lösenord');
        res.status(200).json({ message: "Lösenord ändrat" });
    } catch (error: any) {
        //ERROR LOG
        logger.error({ userId: req.user?.id, err: error.message }, 'Error during changePassword controller execution');
        res.status(400).json({ message: "Kunde inte byta lösenord" });
    }
};