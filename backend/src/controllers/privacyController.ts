import { Request, Response } from 'express';
import { Types } from 'mongoose';
import fs from 'fs';
import path from 'path';
import { uploadDirectory } from '../config/upload'; // Din mapp för bilder
import User from '../models/User';
import Listning from '../models/Listning';
import Favorite from '../models/Favorite';
import Booking from '../models/Booking';
import Message from '../models/Message';
import { Property } from '../models/property';
import { Review } from '../models/Review';

export const exportUserData = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        const userObjectId = new Types.ObjectId(userId);

        const [listings, properties, favorites, bookings, messages, reviews] = await Promise.all([
            Listning.find({ userId: userObjectId } as any),
            Property.find({ owner: userObjectId } as any),
            Favorite.find({ userId: userObjectId } as any),
            Booking.find({ guestId: userObjectId } as any),
            Message.find({ $or: [{ sender: userObjectId }, { receiver: userObjectId }] } as any),
            Review.find({ author: userObjectId } as any)
        ]);

        const exportData = {
            profile: await User.findById(userObjectId).select('-password'),
            exportedAt: new Date().toISOString(),
            listings,
            properties,
            favorites,
            bookings,
            messages,
            reviews
        };

        res.status(200).json(exportData);
    } catch (error) {
        console.error("Export Error:", error);
        res.status(500).json({ message: "Kunde inte exportera data" });
    }
};

export const deleteUserAccount = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        const userObjectId = new Types.ObjectId(userId);

        // 1. Hämta användarens listningar för att kunna radera deras bilder
        const userListings = await Listning.find({ userId: userObjectId } as any);

        // 2. Radera bildfilerna fysiskt från mappen 'uploads'
        for (const listing of userListings) {
            if (listing.images && listing.images.length > 0) {
                listing.images.forEach((img) => {
                    const filePath = path.join(uploadDirectory, img.filename);
                    if (fs.existsSync(filePath)) {
                        fs.unlinkSync(filePath);
                    }
                });
            }
        }

        // 3. Radera all data i databasen
        await Promise.all([
            Listning.deleteMany({ userId: userObjectId } as any),
            Property.deleteMany({ owner: userObjectId } as any),
            Favorite.deleteMany({ userId: userObjectId } as any),
            Booking.deleteMany({ guestId: userObjectId } as any),
            Message.deleteMany({ $or: [{ sender: userObjectId }, { receiver: userObjectId }] } as any),
            Review.deleteMany({ author: userObjectId } as any),
            User.findByIdAndDelete(userObjectId)
        ]);

        res.status(200).json({ message: "Konto och all data har raderats permanent." });
    } catch (error) {
        console.error("Delete Error:", error);
        res.status(500).json({ message: "Kunde inte radera kontot." });
    }
};