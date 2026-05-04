import { Router, Request, Response } from 'express';
import User from '../models/User';
import bcrypt from 'bcryptjs';

const authRoutes = Router();

authRoutes.post('/login', async (req: Request, res: Response) => {
    try{
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if(!user){
            return res.status(401).json({message: "Fel email eller lösenord"});
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch){
            return res.status(401).json({message: "Fel email eller lösenord"});
        }

        res.status(200).json({message: "Du är inloggad"});
    }

    catch(error){
        res.status(500).json({message: "Serverfel"});
    }
});

export default authRoutes;