import { Request, Response, NextFunction } from 'express';
import Booking from '../models/Booking';

import User from '../models/User';
import { sendBookingConfirmation, sendPaymentConfirmation } from '../config/nodemailer';
import { logger } from './../logger/logger';
import mongoose from 'mongoose';
import Listning from '../models/Listning';

// GET /bookings/property/:propertyId - Hämtar icke-avbokade bokningar för fastighetens tidslinje
export const getBookingsForProperty = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { propertyId } = req.params;
        logger.info({ propertyId }, "Hämtar icke-avbokade bokningar för fastighetens tidslinje");
        const bookings = await Booking.find({
            propertyId,
            status: { $ne: "cancelled" }
        }).select("startDate endDate");

        res.status(200).json({
            status: "success",
            results: bookings.length,
            data: bookings
        });
    } catch (error: any) {
        logger.error({ err: error.message, propertyId: req.params.propertyId }, "Fel vid hämtning av bokningar för boendet");
        next(error);
    }
};

// POST /bookings - Skapa en ny bokning
export const createBooking = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    console.log("!!! createBooking controller anropad !!!");
    try {
        const { propertyId, checkIn, checkOut } = req.body;
        const userId = req.user?.id;

        logger.info({ userId, propertyId, checkIn, checkOut }, "Initierad begäran om att skapa en bokning");

        if (!userId) {
            res.status(401).json({ status: 'fail', message: 'Du måste vara inloggad för att boka.' });
            return;
        }

        const start = new Date(checkIn);
        const end = new Date(checkOut);

        if (start >= end) {
            logger.warn({ userId, checkIn, checkOut }, "Bokningen misslyckades – incheckningsdatumet är efter utcheckningen.");
            res.status(400).json({
                status: "fail",
                message: "Incheckning måste vara före utcheckning.",
            });
            return;
        }

        // Kontrollera överlappande bokningar
        const conflict = await Booking.findOne({
            propertyId,
            status: { $ne: "cancelled" },
            startDate: { $lt: end },
            endDate: { $gt: start },
        });

        if (conflict) {
            logger.warn({ propertyId, checkIn, checkOut, conflictId: conflict._id }, "Bokningen misslyckades - Datumöverlappning/konflikt hittades.");
            res.status(409).json({
                status: "fail",
                message: "Boendet är redan bokat.",
            });
            return;
        }

        const property = await Listning.findById(propertyId);

        if (!property) {
            logger.warn({ propertyId }, "Bokningen misslyckades – Målfastigheten finns inte");
            res.status(404).json({
                status: "fail",
                message: "Boendet hittades inte.",
            });
            return;
        }

        // Validera att boendet är godkänt av administratör
        if ((property as any).status !== 'approved') {
            res.status(400).json({
                status: 'fail',
                message: 'Boendet är inte tillgängligt för bokning.'
            });
            return;
        }

        // Validera värdens valda tillgänglighetsintervall om det finns angivet
        if ((property as any).availability && (property as any).availability.length > 0) {
            const isWithinAvailableRange = (property as any).availability.some((range: any) => {
                return start >= new Date(range.startDate) && end <= new Date(range.endDate);
            });

            if (!isWithinAvailableRange) {
                res.status(400).json({
                    status: 'fail',
                    message: 'Boendet är inte tillgängligt för alla valda datum.'
                });
                return;
            }
        }

        const totalNights = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
        const pricePerNight = (property as any).pricePerNight || (property as any).price || 0;
        const totalPrice = totalNights * pricePerNight;

        const booking = await Booking.create({
            propertyId: new mongoose.Types.ObjectId(propertyId),
            userId: new mongoose.Types.ObjectId(userId),
            startDate: start,
            endDate: end,
            totalPrice,
            status: "confirmed",
            paymentStatus: "unpaid",
        });

        logger.info({ bookingId: booking._id, userId, totalPrice }, "Bokningen har sparats i databasen");

        const user = await User.findById(userId);
        if (user) {
            sendBookingConfirmation({
                email: user.email,
                guestName: user.name,
                propertyTitle: (property as any).title,
                checkIn: start.toLocaleDateString("sv-SE"),
                checkOut: end.toLocaleDateString("sv-SE"),
                totalPrice,
            });
            logger.info({ bookingId: booking._id, email: user.email }, "Bokningsbekräftelsemejlet har utlösts");
        }

        res.status(201).json({
            status: "success",
            data: booking,
        });

    } catch (error: any) {
        logger.error({ err: error.message, stack: error.stack }, "Kritiskt fel under bokningsprocessen");
        next(error);
    }
};

// POST /bookings/:id/pay - Genomför betalning för en bokning
export const payBooking = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const bookingId = req.params.id;
        logger.info({ bookingId }, "Bearbetar bokningsbetalningsförfrågan");
        const booking = await Booking.findById(bookingId).populate("propertyId");

        if (!booking) {
            logger.warn({ bookingId }, "Betalning misslyckades - Bokningen hittades inte");
            res.status(404).json({
                status: "fail",
                message: "Bokningen hittades inte."
            });
            return;
        }

        booking.paymentStatus = "paid";
        booking.status = "confirmed";
        await booking.save();

        logger.info({ bookingId, totalPrice: booking.totalPrice }, "Bokningen har markerats som BETALD");

        const user = await User.findById(booking.userId);
        if (!user) {
            logger.warn({ userId: booking.userId, bookingId }, "Betalning behandlad men användarkontext saknas för faktura-e-post");
            res.status(404).json({
                status: "fail",
                message: "Användaren hittades inte.",
            });
            return;
        }

        const property = booking.propertyId as any;

        await sendPaymentConfirmation({
            email: user.email,
            guestName: user.name,
            propertyTitle: property?.title,
            totalPrice: booking.totalPrice,
            checkIn: new Date(booking.startDate).toLocaleDateString("sv-SE"),
            checkOut: new Date(booking.endDate).toLocaleDateString("sv-SE"),
        });

        logger.info({ bookingId, email: user.email }, "Betalningsbekräftelse via e-post skickades");
        res.json({
            status: "success",
            message: "Betalning bekräftad.",
            data: booking,
        });
    } catch (error: any) {
        logger.error({ err: error.message, bookingId: req.params.id }, "Kritiskt fel under bearbetning av betalningscheck");
        next(error);
    }
};

// GET /bookings - Hämta alla bokningar för den inloggade gästen
export const getMyBookings = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = req.user?.id;
        logger.info({ userId }, "Hämtar bokningslista för instrumentpanelen för användaren");

        const bookings = await Booking.find({ userId })
            .populate({
                path: 'propertyId',
                select: 'title location images price'
            })
            .sort('-createdAt');

        res.status(200).json({
            status: 'success',
            results: bookings.length,
            data: bookings,
        });
    } catch (error: any) {
        logger.error({ err: error.message, userId: req.user?.id }, "Error fetching booking dashboard list");
        next(error);
    }
};

// GET /bookings/host - Hämta alla bokningar för en värds fastigheter
export const getHostBookings = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const hostId = req.user?.id;

        if (!hostId) {
            res.status(401).json({ status: 'fail', message: 'Du måste vara inloggad.' });
            return;
        }

        // Hittar alla fastigheter som tillhör den inloggade värden
        const hostListings = await Listning.find({ userId: new mongoose.Types.ObjectId(hostId as string) } as any ).select('_id');
        const propertyIds = hostListings.map((listing) => listing._id);

        const bookings = await Booking.find({ propertyId: { $in: propertyIds } })
            .populate({
                path: 'propertyId',
                select: 'title location images price'
            })
            .populate({
                path: 'userId',
                select: 'name email'
            })
            .sort('-createdAt');

        res.status(200).json({
            status: 'success',
            results: bookings.length,
            data: bookings,
        });
    } catch (error: any) {
        next(error);
    }
};

// GET /bookings/:id - Hämta en specifik bokning via ID
export const getBookingById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const bookingId = req.params.id;
        logger.info({ bookingId, userId: req.user?.id }, "Hämtar detaljer om fristående bokningsinstans");
        const booking = await Booking.findById(bookingId).populate('propertyId');

        if (!booking) {
            logger.warn({ bookingId }, "Misslyckades med att hämta fristående bokningar – hittades inte");
            res.status(404).json({
                status: 'fail',
                message: 'Bokningen existerar inte.',
            });
            return;
        }

        if (booking.userId.toString() !== req.user?.id) {
            logger.warn({ bookingId, requesterId: req.user?.id, realOwnerId: booking.userId }, "Obehörigt försök att få åtkomst till privat bokningsdata");
            res.status(403).json({ status: 'fail', message: 'Du saknar behörighet att visa denna bokning.' });
            return;
        }

        res.status(200).json({ status: 'success', data: booking });
    } catch (error: any) {
        logger.error({ err: error.message, bookingId: req.params.id }, "Fel i hanteraren för enskild bokningsfråga");
        next(error);
    }
};

// DELETE /bookings/:id - Avboka en bokning
export const cancelBooking = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const bookingId = req.params.id;
        logger.info({ bookingId, userId: req.user?.id }, "Avbokningsförfrågan har skickats in för bokning");
        const booking = await Booking.findById(bookingId);

        if (!booking) {
            logger.warn({ bookingId }, "Avbokning avvisad – bokningen hittades inte");
            res.status(404).json({ status: 'fail', message: 'Bokningen hittades inte.' });
            return;
        }

        if (booking.userId.toString() !== req.user?.id) {
            logger.warn({ bookingId, violatorId: req.user?.id }, "Avbokning avvisad – Begärande part är inte ägare till resan");
            res.status(403).json({ status: 'fail', message: 'Du kan bara avboka dina egna resor.' });
            return;
        }

        if (new Date(booking.startDate) < new Date()) {
            logger.warn({ bookingId, startDate: booking.startDate }, "Avbokning avvisad – Vistelsen har redan påbörjats");
            res.status(400).json({ status: 'fail', message: 'Du kan inte avboka en resa som redan påbörjats.' });
            return;
        }

        booking.status = 'cancelled';
        await booking.save();

        logger.info({ bookingId, userId: req.user?.id }, "Bokningsstatus har ändrats till avbruten");
        res.status(200).json({ status: 'success', message: 'Bokningen har avbokats.', data: booking });
    } catch (error: any) {
        logger.error({ err: error.message, bookingId: req.params.id }, "Fel vid bearbetning av bokningsavbokningssekvens");
        next(error);
    }
};