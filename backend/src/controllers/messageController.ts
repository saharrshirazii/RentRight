import { Request, Response } from 'express';
import Message from '../models/Message';
import {logger} from './../logger/logger';



export const sendMessage = async (req: Request, res: Response) => {
    try{
        // 1. Ändra så att vi tar emot de namn som frontenden skickar
        const { recipientId, content, propertyTitle } = req.body;

        const sender: any = req.user?.id;

        // 2. Uppdatera valideringen
        if(!sender || !recipientId || !content){
            logger.warn({ senderId: sender, receiverId: recipientId, hasText: !!content }, "Meddelandeskapandet avvisades");
            return res.status(400).json ({message: "Mottagare, text och giltig inloggning krävs."})
        }

        // 3. Skicka in datan till databasen
        // Obs: Här mappar vi om till 'receiver' och 'text' som din modell vill ha
        const newMessage = await Message.create({ 
            sender, 
            receiver: recipientId, 
            text: content,
            listingTitle: propertyTitle // Spara även titeln om du vill ha den i databasen
        });
        
        logger.info({ messageId: newMessage._id, sender, receiver: recipientId }, "Meddelandet har skapats");
        res.status(201).json({success: true, data: newMessage})

    } catch(error: any){
        console.error(error);
        logger.error({ err: error.message, senderId: req.user?.id }, "Kritiskt fel");
        res.status(500).json ({message: "Serverfel"})
    }
}



export const getConversation = async (req: Request, res: Response) => {
    try{

        const currentUser: any = req.user?.id;
        const {userId} = req.params;

        if(!currentUser || !userId){
            //WARN LOG
            logger.warn({ currentUserId: currentUser, targetUserId: userId }, "Misslyckades med att hämta konversationsloggar - Ogiltiga parametrar");
            return res.status(400).json({message: "Du måste vara inloggad och ett giltigt användar-ID krävs."})
        }

        //INFO LOG
        logger.info({ currentUserId: currentUser, chatPartnerId: userId }, "Hämtar loggar från chatttidslinjen mellan två deltagare");
        const messages = await Message.find({$or:[{sender: currentUser, receiver: userId}, { sender: userId, receiver: currentUser }]} as any).sort({createdAt: 1})

        res.status(200).json({ success: true, data: messages })

    } catch(error:any){
        console.error(error);
        //ERROR LOG
        logger.error({ err: error.message, currentUserId: req.user?.id, targetUserId: req.params.userId }, "Fel vid hämtning av konversationshistorik");
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

        const message = await Message.findById(messageId);
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
            //WARN LOG
            logger.warn("Obehörigt försök att kompilera registerstacken för chatt-inkorgen");
            return res.status(401).json({message: "Du måste vara inloggad"})
        }

        //INFO LOG
        logger.info({ currentUserId: currentUser }, "Sammanställa unika chattkanaler för sammanfattning av inkorgen");
        const allMessages = await Message.find({$or:[{sender: currentUser}, {receiver: currentUser}]} as any).sort({createdAt: -1})

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

        //INFO LOG
        logger.info({ currentUserId: currentUser, activeChannelsCount: inbox.length }, "Inkorgens sammanställningscykel slutfördes smidigt");
        res.status(200).json({success:true, data: inbox})

    }catch(error:any){
        console.error(error);
        //ERROR LOG
        logger.error({ err: error.message, currentUserId: req.user?.id }, "Kris vid spårning vid läsning av data i chattmeddelandemappar");
        res.status(500).json({message: "Serverfel"})
    }
}

export const getAllMessages = async (req: Request, res: Response) => {
    try{
        const currentUser: any = req.user?.id;

        if(!currentUser){
            return res.status(401).json({message: "Du måste vara inloggad"})
        }

        const messages = await Message.find({$or:[{sender: currentUser}, {receiver: currentUser}]} as any).sort({createdAt: -1})

        res.status(200).json({success:true, data: messages})

    }catch(error){
        console.error(error);
        res.status(500).json({message: "Serverfel"})
    }
}