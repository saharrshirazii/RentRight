import { Request, Response, NextFunction } from 'express'
import {NotFoundError , ValidationError} from '../errors/AppError'
import mongoose from 'mongoose'
import Property from '../models/Property';
import Booking from '../models/Booking'



//READ - GET /properties – get all properties
export const getProperties = async (req: Request, res: Response, next: NextFunction) => {
    try {

        //FILTERING
        const filter: any = {};

        if (req.query.location){
            filter.location = {$regex: req.query.location, $options: 'i'};
        }

        if (req.query.guests) {
            filter.guests = parseInt(req.query.guests as string, 10);
        }

        if (req.query.category) {
            filter.category = req.query.category;
        }

        if (req.query.price) {
            const price = req.query.price;

            if (price === 'low') {
                filter.pricePerNight = { $lt: 1000 };
            }

            if (price === 'mid') {
                filter.pricePerNight = {
                    $gte: 1000,
                    $lte: 2000
                };
            }

            if (price === 'high') {
                filter.pricePerNight = { $gt: 2000 };
            }
        }

        //
        const {checkIn , checkOut} = req.body;
        if(checkIn && checkOut) {
            const searchStart = new Date (checkIn as string);
            const searchEnd = new Date (checkOut as string);

            if (searchStart >= searchEnd){
                filter._id = new mongoose.Types.ObjectId();
            }else {
                const overlappingBookings = await booking.find({
                    status : {$ne : 'cancelled'},
                    startDate: {$lt : searchEnd},
                    endDate: {$gt : searchStart}
                }).select('propertyId');

                const busyPropertyIds = overlappingBookings.map(b => b.PropertyId);

                filter._id = {$nin: busyPropertyIds};
            }
        }


        //PAGINATION
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 6;
        const skip = (page - 1) * limit;

        //EXECUTION
        const properties = await Property.find(filter)
        .populate('owner', 'name email')
        .skip(skip)
        .limit(limit);


        //DATA FOR FRONTEND
        const totalProperties = await Property.countDocuments(filter);
        const totalPages = Math.ceil(totalProperties / limit);

        res.status(200).json({
            status: 'success',
            results: properties.length,
            pagination: {
                totalProperties,
                totalPages,
                currentPage: page,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1
            },
            data: properties
        });


    } catch (err) {
        next(err); //sends to our customHandler
    }
};

//READ - GET /properties/:id – get a spesific property
export const getProperty = async (req: Request, res: Response, next:NextFunction) => {
    try {
        const property = await Property.findById(req.params.id).populate('owner', 'name email');
        if (!property) {
            throw new NotFoundError('Fastigheten hittades inte.');
        }
        res.status(200).json({
            status: 'success',
            data: property
        });

    } catch (err) {
        next(err);
    }
};

//POST /properties - create a new property
export const postProperty = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const property = await Property.create(req.body);
        res.status(201).json({
            status: 'success',
            data: property
        });
    } catch (err: any) {
        next(new ValidationError(err.message)); //// If Mongoose validation fails, we wrap it in our ValidationError
    }
};



//PUT /properties/:id - update a propert
export const putProperty = async (req: Request, res: Response , next: NextFunction) => {
    try {
        const property = await Property.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true, runValidators: true }
        );
        if (!property) {
             throw new NotFoundError('Fastigheten hittades inte.' );
        }
        res.status(200).json({
            status: 'success',
            data: property
        });
    } catch (err) {
        next(err);
    }
};




//DELETE /properties /:id - delete a property
export const deleteProperty = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const property = await Property.findByIdAndDelete(req.params.id);
        if (!property) {
            throw new NotFoundError('Fastigheten hittades inte.');
        }
        res.status(204).send()
    } catch (err) {
        next(err);
    }
};