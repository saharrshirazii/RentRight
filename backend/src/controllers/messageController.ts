import { Request, Response } from 'express';
import IMessage  from '../models/Message';


export const sendMessage = async (req: Request, res: Response) => {
    try{
        const {receiver, text} = req.body;

        const sender:any = req.user?.id;

        if(!sender || !receiver || !text){
            return res.status(400).json ({message: "Mottagare, text och giltig inloggning krävs."})
        }

        const newMessage = await IMessage.create({ sender, receiver, text })
        res.status(201).json({success:true, data:newMessage})

    } catch(error){
        console.error(error);
        res.status(500).json ({message: "Serverfel"})
    }
}



export const getConversation = async (req: Request, res: Response) => {
    try{

        const currentUser: any = req.user?.id;
        const {userId} = req.params;

        if(!currentUser || !userId){
            return res.status(400).json({message: "Du måste vara inloggad och ett giltigt användar-ID krävs."})
        }

        const messages = await IMessage.find({$or:[{sender: currentUser, receiver: userId}, { sender: userId, receiver: currentUser }]} as any).sort({createdAt: 1})

        res.status(200).json({ success: true, data: messages })

    } catch(error){
        console.error(error);
        res.status(500).json({message: "Serverfel"})
    }
}
export const deleteMessage = async (req: Request, res: Response) => {
    try {
        const currentUser: any = req.user?.id;
        const messageId = req.params.id;

        if (!currentUser || !messageId) {
            return res.status(400).json({ message: 'Giltig inloggning och meddelande-ID krävs.' });
        }

        const message = await IMessage.findById(messageId);
        if (!message) {
            return res.status(404).json({ message: 'Meddelandet hittades inte.' });
        }

        const isOwner = message.sender.toString() === currentUser.toString() || message.receiver.toString() === currentUser.toString();
        if (!isOwner) {
            return res.status(403).json({ message: 'Du kan inte ta bort det här meddelandet.' });
        }

        await message.deleteOne();
        res.status(200).json({ success: true, message: 'Meddelandet har tagits bort.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Serverfel' });
    }
}
export const getInbox = async (req: Request, res: Response) => {
    try{

        const currentUser: any = req.user?.id;

        if(!currentUser){
            return res.status(401).json({message: "Du måste vara inloggad"})
        }

        const allMessages = await IMessage.find({$or:[{sender: currentUser}, {receiver: currentUser}]} as any).sort({createdAt: -1})

        let inbox: any[] = [];

        for(const msg of allMessages){
            const otherUser = msg.sender.toString() === currentUser.toString()
            ? msg.receiver : msg.sender;

            const conversationExist = inbox.find(item => item.user.toString() === otherUser.toString());

            if(!conversationExist){
                inbox.push({
                    user: otherUser,
                    lastMessage: msg.text,
                    date: msg.createdAt
                })
            }
        }

        res.status(200).json({success:true, data: inbox})

    }catch(error){
        console.error(error);
        res.status(500).json({message: "Serverfel"})
    }
}

export const getAllMessages = async (req: Request, res: Response) => {
    try{
        const currentUser: any = req.user?.id;

        if(!currentUser){
            return res.status(401).json({message: "Du måste vara inloggad"})
        }

        const messages = await IMessage.find({$or:[{sender: currentUser}, {receiver: currentUser}]} as any).sort({createdAt: -1})

        res.status(200).json({success:true, data: messages})

    }catch(error){
        console.error(error);
        res.status(500).json({message: "Serverfel"})
    }
}