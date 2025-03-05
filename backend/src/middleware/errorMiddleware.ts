import { NextFunction, Request, Response } from 'express';
import { ValidError, UnauthorizedError, ForbiddenError, NotFoundedError, ServerError } from '../utils/errors';

type CustomError = ValidError | UnauthorizedError | ForbiddenError | NotFoundedError | ServerError;

const errorMiddleware = (err: CustomError, req: Request, res: Response, next: NextFunction): void => {
    console.error(`[ERROR] ${err.name}: ${err.message}`);

    const statusCode: number = err.statusCode || 500;
    const message: string = err.message || 'Something went wrong';

    if (typeof res.status !== 'function') {
        console.error('res is not a valid Response object');
        return next(err);
    }

    res.status(statusCode).json({ error: message });
};

export default errorMiddleware;
