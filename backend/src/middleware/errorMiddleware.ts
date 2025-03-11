import { NextFunction, Request, Response } from 'express';
import CustomError from '@utils/CustomError.js';
// import { UniqueConstraintError } from 'sequelize';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const errorMiddleware = (err: Error, req: Request, res: Response, next: NextFunction): void => {
    let statusCode: number = 500;
    let message: string = 'Something went wrong';

    if (err instanceof CustomError) {
        statusCode = err.statusCode;
        message = err.message;
    }

    console.error(`[ERROR] ${statusCode}: ${err.message}`);

    res.status(statusCode).json({ error: message });
};

export default errorMiddleware;
