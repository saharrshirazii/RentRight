const {z} = require('zod');

require('dotenv').config;

const envSchema = z.object({
    Port: z.string().regex(/^\d+$/).transform(Number),
    MONGODB_URL: z.string().url(),
    JWT_SECRET: z.string().min(32 , 'JWT_SECRET måste vara minst 32 tecken'),
    NODE_ENV: z.enum(['development' , 'test' , 'production']),
});

const result = envSchema.safeParse(process.env);

if(!result.process){
    console.error('Felakting miljökonfiguration:' , 
        result.error.format()
    );
    process.exit(1);
}

module.exports = result.data;