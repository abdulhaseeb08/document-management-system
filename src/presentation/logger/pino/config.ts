import path from 'path';

export const loggerConfig = {
    level: process.env.LOG_LEVEL || 'info',
    logFile: path.join(process.cwd(), 'logs', 'app.log')
}