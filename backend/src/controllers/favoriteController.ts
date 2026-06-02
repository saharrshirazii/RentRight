import { Request, Response } from 'express';
import { Types } from 'mongoose'; 
import Favorite from '../models/Favorite';
import { IProperty } from '../models/Property'; 

interface PopulatedFavorite {
    userId: Types.ObjectId; 
    propertyId: IProperty;
}

//HÄMTA ALLA FAVORITER - man måste vara inloggad för att kunna favoritmarkera och spara ett boende i sin lista
export const getFavorites = async (req: Request, res: Response): Promise<void> => {
    try {
        const userIdStr = req.user?.id;
        if (!userIdStr) {
            res.status(401).json({ message: "Du måste vara inloggad." });
            return;
        }

        const userId = new Types.ObjectId(userIdStr);

        // Vi sätter "as any" på sökobjektet - detta för att komma förbi vakten som annars ger oss felmarkeringar när vi söker efter userId
        const favoriteDocs = await Favorite.find({ userId } as any).populate('propertyId') as unknown as PopulatedFavorite[];

        const cleanProperties = favoriteDocs
            .filter(fav => fav.propertyId !== null)
            .map(fav => fav?.propertyId);

        res.status(200).json({ success: true, data: cleanProperties });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Serverfel" });
    }
};

//SPARA EN FAVORIT
export const addFavorite = async (req: Request, res: Response): Promise<void> => {
    try {
        const userIdStr = req.user?.id;
        const { propertyId } = req.body;

        if (!userIdStr || !propertyId) {
            res.status(400).json({ message: "Giltig inloggning och fastighets-ID krävs." });
            return;
        }

        const userId = new Types.ObjectId(userIdStr);

        // "as any" här säkrar att .create inte klagar på userId - även här för att ta oss förbi en strikt säkerhetsvakt
        const newFavorite = await Favorite.create({ userId, propertyId } as any);
        res.status(201).json({ success: true, data: newFavorite });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Serverfel" });
    }
};

//TA BORT EN FAVORIT
export const removeFavorite = async (req: Request, res: Response): Promise<void> => {
    try {
        const userIdStr = req.user?.id;
        const { propertyId } = req.params;

        if (!userIdStr || !propertyId) {
            res.status(400).json({ message: "Giltig inloggning och fastighets-ID krävs." });
            return;
        }

        const userId = new Types.ObjectId(userIdStr);

        // TA BORT FAVORIT - as any här igen för att ta oss förbi säkerhetsvakten när vi vill ta bort en favoritmarkering
        await Favorite.findOneAndDelete({ userId, propertyId } as any);
        res.status(200).json({ success: true, message: "Favorit borttagen." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Serverfel" });
    }
};

//KOLLA STATUS
export const checkFavoriteStatus = async (req: Request, res: Response): Promise<void> => {
    try {
        const userIdStr = req.user?.id;
        const { propertyId } = req.params;

        if (!userIdStr || !propertyId) {
            res.status(400).json({ message: "Giltig inloggning och fastighets-ID krävs." });
            return;
        }

        const userId = new Types.ObjectId(userIdStr);

        //as any för att ta oss förbi säkerhetsvakt - här tittar vi om användaren har gillat ett boende och har den det och boendet finns kvar så blir hjärtat rödmarkerat vid inläsning av appen på startsidan och den samlas även under favoritmarkeringar i profilepage - detta för att förhindra dubletter att användaren inte ska gilla samma boende två gånger
        const favorite = await Favorite.findOne({ userId, propertyId } as any);
        res.status(200).json({ success: true, isFavorite: !!favorite });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Serverfel" });
    }
};