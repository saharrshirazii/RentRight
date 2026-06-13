import { Request, Response, NextFunction } from 'express'
import {NotFoundError , ValidationError} from '../errors/AppError'
import mongoose from 'mongoose'
import Property from '../models/Property';
import Booking from '../models/Booking';
import {logger} from './../logger/logger'



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
        const {checkIn , checkOut} = req.query;
        if(checkIn && checkOut) {
            const searchStart = new Date (checkIn as string);
            const searchEnd = new Date (checkOut as string);

            if (searchStart >= searchEnd){
                //WARN LOG
                logger.warn({ checkIn, checkOut }, "Egenskapsförfrågan mottagen med ogiltig datumsekvens (checkIn >= checkOut)");
                filter._id = new mongoose.Types.ObjectId();
            }else {
                const overlappingBookings = await Booking.find({
                    status : {$ne : 'cancelled'},
                    startDate: {$lt : searchEnd},
                    endDate: {$gt : searchStart}
                }).select('propertyId');


                const busyPropertyIds = overlappingBookings.map((b: any) => b.PropertyId);

                filter._id = {$nin: busyPropertyIds};
                //INFO LOG
                logger.info(
                    { overlappingCount: busyPropertyIds.length, checkIn, checkOut },
                    "Filtrerade bort boenden med hög belastning för begärda datum"
                );
            }
        }


        //PAGINATION
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 6;
        const skip = (page - 1) * limit;

        //INFO LOG
        logger.info(
            { location: req.query.location, category: req.query.category, page, limit },
            "Utför sökning efter global fastighetsmarknad"
        );

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


    } catch (err: any) {
        //ERROR LOG
        logger.error({ err: err.message, query: req.query }, "Fel vid sammanställning av poster i katalogen för marknadsplatsens egendom");
        next(err); //sends to our customHandler
    }
};

//READ - GET /properties/:id – get a spesific property
export const getProperty = async (req: Request, res: Response, next:NextFunction) => {
    try {
        const propertyId = req.params.id;
        //INFO LOG
        logger.info({ propertyId }, "Hämtar individuella boendeprofilposter");
        const property = await Property.findById(req.params.id).populate('owner', 'name email');
        if (!property) {
            //WARN LOG
            logger.warn({ propertyId }, "Fastighetsprofilering begärd men resursen hittades inte");
            throw new NotFoundError('Fastigheten hittades inte.');
        }
        res.status(200).json({
            status: 'success',
            data: property
        });

    } catch (err:any) {
        //WARN/ERROR LOG
        if (err instanceof NotFoundError) {
            logger.warn({ propertyId: req.params.id, message: err.message }, "Property document fetch failed gracefully");
        } else {
            logger.error({ err: err.message, propertyId: req.params.id }, "Unexpected failure reading target listing profile");
        }
        next(err);
    }
};

//POST /properties - create a new property
export const postProperty = async (req: Request, res: Response, next: NextFunction) => {
    try {
        //INFO LOG
        logger.info({ title: req.body?.title, location: req.body?.location }, "Tar emot kataloguppladdningssändning från värden");
        const property = await Property.create(req.body);
        //INFO LOG
        logger.info({ propertyId: property._id, ownerId: property.owner }, "Boendet har katalogiserats och listats på marknadsplatsen");
        res.status(201).json({
            status: 'success',
            data: property
        });
    } catch (err: any) {
        //WARN LOG
        logger.warn({ err: err.message }, "Transaktionen för publicering av listning avvisades på grund av fel i strukturella valideringsregler");
        next(new ValidationError(err.message)); //// If Mongoose validation fails, we wrap it in our ValidationError
    }
};



//PUT /properties/:id - update a propert
export const putProperty = async (req: Request, res: Response , next: NextFunction) => {
    try {
        const propertyId = req.params.id;
        //INFO LOG
        logger.info({ propertyId }, "Initierar ändringar av nyttolastens sammanslagningssekvens för listning");
        const property = await Property.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true, runValidators: true }
        );
        if (!property) {
            //WARN LOG
            logger.warn({ propertyId }, "Uppdateringsåtgärden avbröts - Målkontextposter finns inte");
             throw new NotFoundError('Fastigheten hittades inte.' );
        }
        //INFO LOG
        logger.info({ propertyId }, "Boendeuppgifterna har uppdaterats");
        res.status(200).json({
            status: 'success',
            data: property
        });
    } catch (err:any) {
        //ERROR LOG
        logger.error({ err: err.message, propertyId: req.params.id }, "Fel uppstod vid bearbetning av uppdateringar av spårningsfilen för ändringar i egenskapslistan");
        next(err);
    }
};




//DELETE /properties /:id - delete a property
export const deleteProperty = async (req: Request, res: Response, next: NextFunction) => {
    try {
        //INFO LOG
        const propertyId = req.params.id;
        logger.info({ propertyId }, "Bearbetningsförfrågningar nyttolastkommando exekveringssekvens för radering av bostadsinträde");
        const property = await Property.findByIdAndDelete(req.params.id);
        if (!property) {
            //WARN LOG
            logger.warn({ propertyId }, "Kommandot för permanent borttagning avvisades – målobjektet finns inte");
            throw new NotFoundError('Fastigheten hittades inte.');
        }
        //INFO LOG
        logger.info({ propertyId }, "Kontextdata för bostadsinträde raderades helt från ekosystemregisterdatabasen");
        res.status(204).send()
    } catch (err:any) {
        //
        logger.error({ err: err.message, propertyId: req.params.id }, "Allvarligt bearbetningsfel i hanterarloopen för strukturell borttagningslogikrutiner");
        next(err);
    }
};