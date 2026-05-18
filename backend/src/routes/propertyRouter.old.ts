import express from 'express';
import { 
    getProperties, 
    getProperty, 
    postProperty, 
    putProperty, 
    deleteProperty 
} from '../controllers/PropertyController';

const propertyRouter = express.Router();

// Path: /api/properties
propertyRouter.get('/' , getProperties);
propertyRouter.post('/' ,postProperty);

// Path: /api/properties/:id
propertyRouter.get('/:id' , getProperty);
propertyRouter.put('/:id' , putProperty);
propertyRouter.delete('/:id' , deleteProperty);

export default propertyRouter;