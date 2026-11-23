import pino from 'pino';

const isVercel = process.env.VERCEL === '1';

export const logger = pino({
    level: process.env.LOG_LEVEL || 'info',

    ...(isVercel
        ? {}
        : {
            transport: {
                target: 'pino-pretty',
                options: {
                    colorize: true,
                    translateTime: 'SYS:standard',
                    ignore: 'pid,hostname',
                },
            },
        }),
});