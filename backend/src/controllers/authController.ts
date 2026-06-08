import { Request, Response } from 'express';
import User from '../models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { registerSchema, loginSchema, changepasswordSchema } from '../validators/authValidator';

const createToken = (id: string, role: string) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET as string, { expiresIn: '1h' });
};

export const register = async (req: Request, res: Response) => {
    try {
        // Validera direkt. Om det misslyckas hoppar den till catch-blocket
        const data = registerSchema.parse(req.body);
        
        const user = await User.create(data);
        const token = createToken(user._id.toString(), user.role);
        
        res.status(201).json({ 
            token, 
            user: { id: user._id.toString(), name: user.name, email: user.email, role: user.role } 
        });
    } catch (error: any) {
        if (error.name === 'ZodError') {
            return res.status(400).json({ message: error.issues[0].message });
        }
        res.status(400).json({ message: "Registrering misslyckades" });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = loginSchema.parse(req.body);
        const user = await User.findOne({ email });
        
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: "Fel e-post eller lösenord" });
        }
        
        const token = createToken(user._id.toString(), user.role);
        res.status(200).json({ 
            token, 
            user: { id: user._id.toString(), name: user.name, email: user.email, role: user.role } 
        });
    } catch (error: any) {
        res.status(401).json({ message: "Inloggning misslyckades" });
    }
};

export const switchRole = async (req: any, res: Response) => {
    try {
        const user = await User.findById(req.user!.id);
        if (!user) return res.status(404).json({ message: "Hittades ej" });

        user.role = user.role === 'guest' ? 'host' : 'guest';
        await user.save();

        const newToken = createToken(user._id.toString(), user.role);

        return res.status(200).json({ id: user._id, name: user.name, email: user.email, role: user.role, token: newToken });
    } catch (error) {
        return res.status(500).json({ message: "Serverfel" });
    }
};

export const changePassword = async (req: any, res: Response) => {
    try {
        const { currentPassword, newPassword } = changepasswordSchema.parse(req.body);
        const user = await User.findById(req.user!.id);
        
        if (!user || !(await bcrypt.compare(currentPassword, user.password))) {
            return res.status(401).json({ message: "Fel lösenord" });
        }
        
        user.password = newPassword; 
        await user.save();
        res.status(200).json({ message: "Lösenord ändrat" });
    } catch (error) {
        res.status(400).json({ message: "Kunde inte byta lösenord" });
    }
};