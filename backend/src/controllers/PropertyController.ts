import { Request, Response, NextFunction } from 'express';
import Property from '../models/property';
import {NotFoundError , ValidationError} from '../errors/AppError';


//READ - GET /properties – get all properties
export const getProperties = async (req: Request, res: Response, next: NextFunction) => {
    try {

        //FILTERING
        const filter: any = {};

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




//DELETE
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