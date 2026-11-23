const {z} = require ('zod');

export const createPropertySchema = z.object({
   body: z.object({
     title: z.string().min(1 , 'Title is required.').max(100).trim(),
    location: z.string().min(1 , 'Location is required.'),
    pricePerNight: z.number().positive('Price most be a positive number.'),
    rating: z.number().min(0).max(5),
    reviews: z.number().int().min(0),
    images: z.array(z.string()).min(1 , 'At least one image is required.'),
    guests: z.number().min(1).max(20).positive(),
    bedrooms: z.number().min(1).max(10).positive(),
    bathrooms: z.number().min(1).max(10).positive(),
    category: z.enum(['Lägenhet' , 'Villa', 'Stuga', 'Radhus', 'Studio']),
    owner: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Owner ID format'),
   })
});

// Create a partial version for updates (all fields become optional)
export const updatePropertySchema = z.object({
    body: createPropertySchema.shape.body.partial()
})
// Validation for the :id in the URL
export const idParamSchema = z.object({
   params : z.object({
     id: z.string().regex(/^[0-9a-fA-F]{24}$/ , 'Invalid ID format'),
   })
});

