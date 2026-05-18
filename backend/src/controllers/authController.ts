import { Request, Response } from 'express';
import User from '../models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// --- REGISTER ---
export const register = async (req: Request, res: Response) => {
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

        const newUser = await User.create({
            name,
            email,
            password, 
            role: finalRole
        });

        res.status(201).json({ 
            message: "Användare skapad", 
            user: { id: newUser._id, name: newUser.name, role: newUser.role } 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Serverfel vid registrering" });
    }
};

// --- LOGIN ---
export const login = async (req: Request, res: Response) => {
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
            user: { id: user._id, name: user.name, email: user.email, role: user.role }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Serverfel vid inloggning" });
    }
};

// --- SWITCH ROLE ---
export const switchRole = async (req: any, res: Response) => {
    try {
        const user = await User.findById(req.user.id);
        
        if (!user) {
            return res.status(404).json({ message: "Användaren hittades inte" });
        }

        const newRole = user.role === 'guest' ? 'host' : 'guest';
        user.role = newRole;

        await user.save();

        res.status(200).json({
            message: `Roll ändrad till ${newRole}`,
            role: user.role
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Serverfel vid byte av roll" });
    }
};

// --- CHANGE PASSWORD (NY!) ---
export const changePassword = async (req: any, res: Response) => {
    try {
        const { currentPassword, newPassword } = req.body;

        // 1. Hämta användaren från databasen via ID från middleware
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "Användaren hittades inte" });
        }

        // 2. Kontrollera att det nuvarande lösenordet är korrekt
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Felaktigt nuvarande lösenord" });
        }

        // 3. Uppdatera lösenordet (din pre-save hook i User-modellen kommer att bocka av och hasha detta automatiskt)
        user.password = newPassword;
        await user.save();

        res.status(200).json({ message: "Lösenordet har ändrats!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Serverfel vid byte av lösenord" });
    }
};