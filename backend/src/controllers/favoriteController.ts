import { Request, Response } from 'express';
import { Types } from 'mongoose'; 
import Favorite from '../models/Favorite';
import { IProperty } from '../models/property'; 
import {logger} from './../logger/logger'

interface PopulatedFavorite {
    userId: Types.ObjectId; 
    propertyId: IProperty;
}

//HÄMTA ALLA FAVORITER - man måste vara inloggad för att kunna favoritmarkera och spara ett boende i sin lista
// I favoriteController.ts

export const getFavorites = async (req: Request, res: Response): Promise<void> => {
    try {
        const userIdStr = req.user?.id;
        if (!userIdStr) {
            //WARN LOG
            logger.warn("Obehörigt försök att hämta favoritlistan - Inget token-användar-ID hittades");
            res.status(401).json({ message: "Du måste vara inloggad." });
            return;
        }

        const userId = new Types.ObjectId(userIdStr);

        //INFO LOG
        logger.info({ userId }, "Hämtar sparad favoritlista för användaren");

        // Vi sätter "as any" på sökobjektet - detta för att komma förbi vakten som annars ger oss felmarkeringar när vi söker efter userId
        const favoriteDocs = await Favorite.find({ userId } as any).populate('propertyId') as unknown as PopulatedFavorite[];
        
        // Mappa om datan så frontenden får det den förväntar sig
        const cleanProperties = favoriteDocs
            .filter(fav => fav.propertyId !== null)
            .map((fav: any) => {
                const p = fav.propertyId;
                return {
                    _id: p._id,
                    title: p.title,
                    location: p.location,
                    pricePerNight: p.price, // Vi mappar om 'price' till 'pricePerNight'
                    images: p.images.map((img: any) => img.url), // Säkerställer bild-URL
                    guests: p.guests,
                    bedrooms: p.bedrooms,
                    bathrooms: p.bathrooms
                };
            });

        res.status(200).json({ success: true, data: cleanProperties });
    } catch (error: any) {
        //ERROR LOG
        logger.error({ err: error.message, userId: req.user?.id }, "Kritiskt fel vid hämtning av favoritlistan");

        res.status(500).json({ message: "Serverfel" });
    }
};

//SPARA EN FAVORIT
export const addFavorite = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id;
        const { propertyId } = req.body;

        console.log("Mottaget från frontend - PropertyID:", propertyId);
        // Skapa instans manuellt
        const fav = new Favorite({
            userId: new Types.ObjectId(userId),
            propertyId: new Types.ObjectId(propertyId)
        });
    
        // Tvinga fram sparande
        const savedFav = await fav.save();
        console.log("Sparad favorit i databasen:", savedFav);

        res.status(201).json({ success: true, data: savedFav });
    } catch (error) {
        console.error("FEL VID SPARANDE:", error);
        res.status(500).json({ message: "Serverfel" });
    }
};

//TA BORT EN FAVORIT
export const removeFavorite = async (req: Request, res: Response): Promise<void> => {
    try {
        const userIdStr = req.user?.id;
        const { propertyId } = req.params;

        if (!userIdStr || !propertyId) {
            //WARN LOG
            logger.warn({ userIdStr, propertyId }, "Misslyckades med att ta bort favorit - Parameterfält saknas");
            res.status(400).json({ message: "Giltig inloggning och fastighets-ID krävs." });
            return;
        }

        const userId = new Types.ObjectId(userIdStr);

        // TA BORT FAVORIT - as any här igen för att ta oss förbi säkerhetsvakten när vi vill ta bort en favoritmarkering
        await Favorite.findOneAndDelete({ userId, propertyId } as any);
        //INFO LOG
        logger.info({ userId, propertyId }, "Användaren tog bort egendomen från sin favoritlista");
        res.status(200).json({ success: true, message: "Favorit borttagen." });
    } catch (error:any) {
        //ERROR LOG
        logger.error({ err: error.message, userId: req.user?.id, propertyId: req.params?.propertyId }, "Fel vid borttagning av egendom från favoritlistan");
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
            //WARN LOG
            logger.warn({ propertyId }, "Kontroll av favoritstatus begärdes utan autentiserad användarkontext");
            res.status(400).json({ message: "Giltig inloggning och fastighets-ID krävs." });
            return;
        }

        const userId = new Types.ObjectId(userIdStr);

        //as any för att ta oss förbi säkerhetsvakt - här tittar vi om användaren har gillat ett boende och har den det och boendet finns kvar så blir hjärtat rödmarkerat vid inläsning av appen på startsidan och den samlas även under favoritmarkeringar i profilepage - detta för att förhindra dubletter att användaren inte ska gilla samma boende två gånger
        const favorite = await Favorite.findOne({ userId, propertyId } as any);
        res.status(200).json({ success: true, isFavorite: !!favorite });
    } catch (error:any) {
        console.error(error);
        //ERROR LOG
        logger.error({ err: error.message, userId: req.user?.id, propertyId: req.params?.propertyId }, "Fel vid beräkning av favoritkontroll");
        res.status(500).json({ message: "Serverfel" });
    }
};
