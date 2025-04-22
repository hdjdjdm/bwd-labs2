import { NextFunction, Request, Response } from 'express';
import { Roles } from '@constants/Roles.js';
import CustomError from '@utils/CustomError.js';
import { ErrorCodes, ErrorMessages } from '@constants/Errors.js';

const checkRole = (requiredRole: Roles) => async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as { role: Roles };
    if (!user || user.role !== requiredRole) {
        return next(new CustomError(ErrorCodes.ForbiddenError, ErrorMessages.ForbiddenError));
    }
    next();
};

export { checkRole };
