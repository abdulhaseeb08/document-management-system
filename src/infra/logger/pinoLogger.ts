import pino from 'pino';
import type { Logger as Pino, LoggerOptions } from 'pino';
import type { Logger } from '../../app/ports/logger/logger';
import { injectable } from 'inversify';
import { exit } from 'process';

@injectable()
export class PinoLogger implements Logger {
    private logger: Pino;

    constructor(options?: LoggerOptions) {
        this.logger = pino(options);
    }

    info(message: string, data?: Record<string, unknown>): void {
        this.logger.info({ message, ...data });
    }

    error(message: string, data?: Record<string, unknown>): void {
        this.logger.error({ message, ...data });
    }

    debug(message: string, data?: Record<string, unknown>): void {
        this.logger.debug({ message, ...data });
    }

    warn(message: string, data?: Record<string, unknown> | undefined): void {
        this.logger.warn({message, ...data});
    }

    fatal(message: string, data?: Record<string, unknown> | undefined): void {
        this.logger.fatal({message, ...data});
        exit(1);
    }

    trace(message: string, data?: Record<string, unknown> | undefined): void {
        this.logger.warn({message, ...data});
    }

}
