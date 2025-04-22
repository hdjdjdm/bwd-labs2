import { NextFunction, Request, Response } from 'express';
import CustomError from '@utils/CustomError.js';
import { ZodError } from 'zod';
import { ErrorCodes } from '@constants/Errors.js';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const errorMiddleware = (err: Error, req: Request, res: Response, next: NextFunction): void => {
    let statusCode: number = 500;
    let message: string = 'Что-то пошло не так';

    if (err instanceof CustomError) {
        statusCode = err.statusCode;
        message = err.message;
    }

    if (err instanceof ZodError) {
        statusCode = ErrorCodes.BadRequest;

        const errors = err.flatten();
        message = Object.entries(errors.fieldErrors)
            .map(([, messages]) => messages?.join(', '))
            .join('; ');
    }

    console.error(`[ERROR] ${statusCode}: ${err.message}`);

    res.status(statusCode).json({ error: message });
};

export default errorMiddleware;
