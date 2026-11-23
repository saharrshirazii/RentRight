import express from 'express';
import { 
    getProperties, 
    getProperty, 
    postProperty, 
    putProperty, 
    deleteProperty 
} from '../controllers/PropertyController';

import { validate } from '../middleware/validateMiddleware';  
import { 
    createPropertySchema, 
    updatePropertySchema, 
    idParamSchema 
} from '../schemas/propertySchemas';

const propertyRouter = express.Router();

// Path: /api/properties
propertyRouter.get('/' , getProperties);
propertyRouter.post('/' ,validate(createPropertySchema), postProperty);

// Path: /api/properties/:id
propertyRouter.get('/:id' , validate(idParamSchema), getProperty);
propertyRouter.put('/:id' , validate(updatePropertySchema), putProperty);
propertyRouter.delete('/:id' , deleteProperty);

export default propertyRouter;