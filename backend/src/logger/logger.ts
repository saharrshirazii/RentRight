import pino from 'pino';

const isProduction = process.env.NODE_ENV === 'production';

export const logger = pino({
    level: process.env.LOG_LEVEL || 'info',
    transport: !isProduction? {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'SYS:yyyy-mm-dd HH:MM:ss',
          ignore: 'pid,hostname',
        },
      }
    : undefined, 
    redact: {
    paths: [
      'req.headers.authorization',
      'req.headers.cookie',
      'req.body.password',
      'req.body.passwordConfirm',
      'req.body.token',
      'res.headers["set-cookie"]',
      '*.password',
      '*.passwordHash',
      '*.token'
    ],
    censor: '[REDACTED]'
  },
   base: {
    service: 'rentright-api',
    env: process.env.NODE_ENV || 'development'
  }
});