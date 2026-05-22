import { Request, Response } from 'express';
import Property from '../models/Property';

//READ - GET /properties – get all properties
export const getProperties = async (req: Request, res: Response) => {
    try {
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
        const properties = await Property.find(filter).populate('owner', 'name email').skip(skip).limit(limit);


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


    } catch (error: any) {
        console.error("Controller Error:", error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

//READ - GET /properties/:id – get a spesific property
export const getProperty = async (req: Request, res: Response) => {
    try {
        const property = await Property.findById(req.params.id).populate('owner', 'name email');
        if (!property) {
            return res.status(404).json({ message: 'Fastigheten hittades inte.' })
        }
        res.json(property);

    } catch (err) {
        res.status(500).json({ message: 'Serverfel vid hämtning av boenden.' });
    }
};

//POST /properties - create a new property
export const postProperty = async (req: Request, res: Response) => {
    try {
        const property = await Property.create(req.body);
        res.status(201).json(property);
    } catch (err: any) {
        res.status(400).json({ message: err.message });
    }
};



//PUT /properties/:id - update a propert
export const putProperty = async (req: Request, res: Response) => {
    try {
        const property = await Property.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true, runValidators: true }
        );
        if (!property) {
            return res.status(404).json({ message: 'Fastigheten hittades inte.' })
        }
        res.json(property);
    } catch (err: any) {
        res.status(400).json({ message: err.message });
    }
};




//DELETE
export const deleteProperty = async (req: Request, res: Response) => {
    try {
        const property = await Property.findByIdAndDelete(req.params.id);
        if (!property) {
            return res.status(404).json({ message: 'Fastigheten hittades inte.' })
        }
        res.status(204).send()
    } catch (err) {
        res.status(500).json({ message: 'Serverfel vid borttagning av boende.' });
    }
};
