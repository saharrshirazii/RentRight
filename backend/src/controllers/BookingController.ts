import { Request, Response, NextFunction } from "express";
import Booking from "../models/Booking";
import Property from "../models/Property";
import User from "../models/User";
import { sendBookingConfirmation, sendPaymentConfirmation } from "../config/nodemailer";
import {logger} from './../logger/logger'


//Get /v1/bookings/:id - get booking for property
export const getBookingsForProperty = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { propertyId } = req.params;
        //INFO LOG
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
        //ERROR LOG
        logger.error({ err: error.message, propertyId: req.params.propertyId }, "Fel vid hämtning av bokningar för boendet");
        next(error);
    }
};

//POST /bookings - create a new booking
export const createBooking = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { propertyId, checkIn, checkOut } = req.body;
        const userId = (req as any).user.id;

        //INFO LOG
        logger.info({ userId, propertyId, checkIn, checkOut }, "Initierad begäran om att skapa en bokning");

        const start = new Date(checkIn);
        const end = new Date(checkOut);

        // 1. Validate dates
        if (start >= end) {
            //WARN LOG
            logger.warn({ userId, checkIn, checkOut }, "Bokningen misslyckades – incheckningsdatumet är efter utcheckningen.");
            res.status(400).json({
                status: "fail",
                message: "Incheckning måste vara före utcheckning.",
            });
            return;
        }

        // 2. Check overlap before creating booking
        const conflict = await Booking.findOne({
            propertyId,
            status: { $ne: "cancelled" },
            startDate: { $lt: end },
            endDate: { $gt: start },
        });

        if (conflict) {
            //WARN LOG
            logger.warn({ propertyId, checkIn, checkOut, conflictId: conflict._id }, "Bokningen misslyckades - Datumöverlappning/konflikt hittades.");
            res.status(409).json({
                status: "fail",
                message: "Boendet är redan bokat.",
            });
            return;
        }

        // 3. Get property
        const property = await Property.findById(propertyId);

        if (!property) {
            //WARN LOG
            logger.warn({ propertyId }, "Bokningen misslyckades – Målfastigheten finns inte");
            res.status(404).json({
                status: "fail",
                message: "Boendet hittades inte.",
            });
            return;
        }

        // 4. Calculate price
        const totalNights = Math.ceil(
            (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
        );

        const totalPrice = totalNights * property.pricePerNight;

        // 5. Create booking
        const booking = await Booking.create({
            userId,
            propertyId,
            startDate: start,
            endDate: end,
            totalPrice,
            status: "confirmed",
            paymentStatus: "unpaid",
        });

        //INFO LOG
logger.info({ bookingId: booking._id, userId, totalPrice }, "Bokningen har sparats i databasen");

        // 6. Send email (safe async, non-blocking)
        const user = await User.findById(userId);

        if (user) {
            sendBookingConfirmation({
                email: user.email,
                guestName: user.name,
                propertyTitle: property.title,
                checkIn: start.toLocaleDateString("sv-SE"),
                checkOut: end.toLocaleDateString("sv-SE"),
                totalPrice,
            });
            //INFO LOG
            logger.info({ bookingId: booking._id, email: user.email }, "Bokningsbekräftelsemejlet har utlösts");
        }

        // 7. Response
        res.status(201).json({
            status: "success",
            data: booking,
        });

    } catch (error: any) {
        //ERROR LOG
        logger.error({ err: error.message, stack: error.stack }, "Kritiskt fel under bokningsprocessen");
        next(error);
    }
};



//POST /bookings/:id/pay
export const payBooking = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const bookingId = req.params.id;
        //INFO LOG
        logger.info({ bookingId }, "Bearbetar bokningsbetalningsförfrågan");
        const booking = await Booking.findById(req.params.id).populate("propertyId");

        if (!booking) {
            //WARN LOG
            logger.warn({ bookingId }, "Betalning misslyckades - Bokningen hittades inte");
            res.status(404).json({
                status: "fail",
                message: "Bokningen hittades inte."
            });
            return;
        }

        // mark as paid
        booking.paymentStatus = "paid";
        booking.status = "confirmed";
        await booking.save();

        //INFO LOG
        logger.info({ bookingId, totalPrice: booking.totalPrice }, "Bokningen har markerats som BETALD");

        const user = await User.findById(booking.userId);

        if (!user) {
            //WARN LOG
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
            propertyTitle: property.title,
            totalPrice: booking.totalPrice,
            checkIn: "",
            checkOut: "",
        });

        //INFO LOG
        logger.info({ bookingId, email: user.email }, "Betalningsbekräftelse via e-post skickades");
        res.json({
            status: "success",
            message: "Betalning bekräftad.",
            data: booking,
        });
    } catch (error: any) {
        //ERROR LOG
        logger.error({ err: error.message, bookingId: req.params.id }, "Kritiskt fel under bearbetning av betalningscheck");
        next(error);
    }
};


//READ - GET /bookings - get all bookings
export const getMyBookings = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        
        const userId = req.user?.id;
        //INFO LOG
        logger.info({ userId }, "Hämtar bokningslista för instrumentpanelen för användaren");

        const bookings = await Booking.find({ userId })
            .populate({
                path: 'propertyId',
                select: 'title location images pricePerNight'
            })
            .sort('-createdAt');

        res.status(200).json({
            status: 'success',
            results: bookings.length,
            data: bookings,
        });

    } catch (error: any) {
        //ERROR LOG
        logger.error({ err: error.message, userId: req.user?.id }, "Error fetching booking dashboard list");
        next(error);

    }
};

//READ - GET/booking/:id - get a booking
export const getBookingById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const bookingId = req.params.id;
        //INFO LOG
        logger.info({ bookingId, userId: req.user?.id }, "Hämtar detaljer om fristående bokningsinstans");
        const booking = await Booking.findById(req.params.id).populate('propertyId');

        if (!booking) {
            //WARN LOG
            logger.warn({ bookingId }, "Misslyckades med att hämta fristående bokningar – hittades inte");
            res.status(404).json({
                status: 'fail',
                message: 'Bokningen existerar inte.',
            });
            return;
        }

        if (booking.userId !== req.user?.id) {
            //WARN LOG
            logger.warn({ bookingId, requesterId: req.user?.id, realOwnerId: booking.userId }, "Obehörigt försök att få åtkomst till privat bokningsdata");
            res.status(403).json({ status: 'fail', message: 'Du saknar behörighet att visa denna bokning.' });
            return;
        }

        res.status(200).json({ status: 'success', data: booking });
    } catch (error: any) {
        //ERROR LOG
        logger.error({ err: error.message, bookingId: req.params.id }, "Fel i hanteraren för enskild bokningsfråga");
        next(error);
    }
};


//DELETE /bookings/:id - cancel a booking
export const cancelBooking = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const bookingId = req.params.id;
        //INFO LOG
        logger.info({ bookingId, userId: req.user?.id }, "Avbokningsförfrågan har skickats in för bokning");
        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            //WARN LOG
            logger.warn({ bookingId }, "Avbokning avvisad – bokningen hittades inte");
            res.status(404).json({ status: 'fail', message: 'Bokningen hittades inte.' });
            return;
        }

        if (booking.userId !== req.user?.id) {
            //WARN LOG
            logger.warn({ bookingId, violatorId: req.user?.id }, "Avbokning avvisad – Begärande part är inte ägare till resan");
            res.status(403).json({ status: 'fail', message: 'Du kan bara avboka dina egna resor.' });
            return;
        }

        if (new Date(booking.startDate) < new Date()) {
            //WARN LOG
            logger.warn({ bookingId, startDate: booking.startDate }, "Avbokning avvisad – Vistelsen har redan påbörjats");
            res.status(400).json({ status: 'fail', message: 'Du kan inte avboka en resa som redan påbörjats.' });
            return;
        }

        booking.status = 'cancelled';
        await booking.save();

        //INFO LOG
        logger.info({ bookingId, userId: req.user?.id }, "Bokningsstatus har ändrats till avbruten");
        res.status(200).json({ status: 'success', message: 'Bokningen har avbokats.', data: booking });
    } catch (error:any) {
        //ERROR LOG
        logger.error({ err: error.message, bookingId: req.params.id }, "Fel vid bearbetning av bokningsavbokningssekvens");
        next(error);
    }
};
