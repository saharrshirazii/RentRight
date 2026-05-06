import { Router, Request, Response } from 'express';
import User from '../models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const authRoutes = Router();

authRoutes.post('/register', async (req: Request, res: Response) => {
    try {
        const { name, email, password, role } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Användare med denna email finns redan" });
        }

        const finalRole = role || 'guest';
        if (finalRole === 'admin') {
            if (!email.endsWith('@rentright.se')) {
                return res.status(403).json({ message: "Endast @rentright.se-adresser får registreras som admin" });
            }
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
            role: finalRole
        });

        res.status(201).json({ 
            message: "Användare skapad", 
            user: { 
                id: newUser._id, 
                name: newUser.name, 
                role: newUser.role 
            } 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Serverfel vid registrering" });
    }
});


authRoutes.post('/login', async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Fel email eller lösenord" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Fel email eller lösenord" });
        }

        const token = jwt.sign(
            { id: user._id, role: user.role }, 
            process.env.JWT_SECRET as string, 
            { expiresIn: '1h' }
        );

        res.status(200).json({
            message: "Du är inloggad",
            token, 
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Serverfel vid inloggning" });
    }
});

export default authRoutes;