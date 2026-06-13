import { Request, Response } from 'express';
import IMessage  from '../models/Message';
import {logger} from './../logger/logger'



export const sendMessage = async (req: Request, res: Response) => {
    try{
        const {receiver, text} = req.body;

        const sender:any = req.user?.id;

        if(!sender || !receiver || !text){
            //WARN LOG
            logger.warn({ senderId: sender, receiverId: receiver, hasText: !!text }, "Meddelandeskapandet avvisades – obligatoriska parametrar saknas");
            return res.status(400).json ({message: "Mottagare, text och giltig inloggning krävs."})
        }

        const newMessage = await IMessage.create({ sender, receiver, text });
        //INFO LOG
        logger.info({ messageId: newMessage._id, sender, receiver }, "Meddelandet har skapats och skickats");
        res.status(201).json({success:true, data:newMessage})

    } catch(error:any){
        console.error(error);
        //ERROR LOG
        logger.error({ err: error.message, senderId: req.user?.id }, "Kritiskt fel vid körning av meddelandeavsändningssekvens");
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
        const messages = await IMessage.find({$or:[{sender: currentUser, receiver: userId}, { sender: userId, receiver: currentUser }]} as any).sort({createdAt: 1})

        res.status(200).json({ success: true, data: messages })

    } catch(error:any){
        console.error(error);
        //ERROR LOG
        logger.error({ err: error.message, currentUserId: req.user?.id, targetUserId: req.params.userId }, "Fel vid hämtning av konversationshistorik");
        res.status(500).json({message: "Serverfel"})
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