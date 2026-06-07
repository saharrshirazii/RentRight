import { Request, Response, NextFunction } from 'express';
import Booking from '../models/Booking';
import Property, { IProperty } from '../models/property';
import mongoose from 'mongoose';


//POST /bookings - create a new booking
export const createBooking = async(req: Request , res: Response , next:NextFunction): Promise<void> => {
    try{
        const {propertyId , checkIn , checkOut} = req.body;

        const userId = req.user?.id;

        const start = new Date(checkIn);
        const end = new Date(checkOut);

        if(start >= end){
            res.status(400).json({
                status: 'fail',
                message: 'Incheckningsdatum måste vara före utcheckning.'
            });
            return;
        }

        // Overlap availability check
        const conflictiongBooking = await Booking.findOne({
            propertyId,
            status: {$ne : 'canceled'},
            startDate: {$lt: end},
            endDate: {$gt: start}
        });

        if(conflictiongBooking){
            res.status(400).json({
                status: 'fail',
                message: 'Boendet är tyvärr redan bokat under dessa datum.'
            });
        return;
        }

const property = await Property.findById<IProperty>(propertyId);

        if(!property) {
            res.status(404).json({
                status: 'fail',
                message: 'Boendet hittades inte.'
            });

            return;
        }

        const totalNights = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

        const totalPrice = totalNights * property.pricePerNight;

       const newBooking = await Booking.create({
            PropertyId: new mongoose.Types.ObjectId(propertyId),
            userId,
            startDate: start,
            endDate: end,
            totalPrice,
            status: 'confirmed',
        });

        res.status(201).json({
            status: 'succes',
            data: newBooking,
        })
    }catch(error){
        next(error)
    }
};

//READ - GET /bookings - get all bookings
export const getMyBookings = async (req:Request , res:Response, next:NextFunction): Promise<void> => {
try{
    const userId = req.user?.id;

    const bookings = await Booking.find({userId})
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

}catch(error){
    next(error);

}
};

//READ - GET/booking/:id - get a booking
export const getBookingById = async (req: Request , res: Response ,  next: NextFunction) : Promise<void> => {
    try {
        const booking = await Booking.findById(req.params.id).populate('propertyId');

        if(!booking){
            res.status(404).json({
                status: 'fail',
                message: 'Bokningen existerar inte.',
            });
            return;
        }

        if (booking.userId !== req.user?.id) {
            res.status(403).json({
                status: 'fail',
                message: 'Du saknar behörighet att visa denna bokning.'
            });
            return;
        }

        res.status(200).json({status: 'success', data: booking});
    }catch (error) {
        next(error);
    }
};


//DELETE /bookings/:id - cancel a booking
export const cancelBooking = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      res.status(404).json({ status: 'fail', message: 'Bokningen hittades inte.' });
      return;
    }

    if (booking.userId !== req.user?.id) {
      res.status(403).json({ status: 'fail', message: 'Du kan bara avboka dina egna resor.' });
      return;
    }

    if (new Date(booking.startDate) < new Date()) {
      res.status(400).json({ status: 'fail', message: 'Du kan inte avboka en resa som redan påbörjats.' });
      return;
    }

    booking.status = 'canceled';
    await booking.save();

    res.status(200).json({ status: 'success', message: 'Bokningen har avbokats.', data: booking });
  } catch (error) {
    next(error);
  }
};
