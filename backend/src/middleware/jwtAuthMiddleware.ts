import passport from 'passport';
import { NextFunction, Request, Response } from 'express';
import User from '@models/User.js';
import CustomError from '@utils/CustomError.js';
import { ErrorCodes } from '@constants/Errors.js';

const jwtAuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate('jwt', { session: false }, (err: Error | null, user: User | false) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return next(new CustomError(ErrorCodes.UnauthorizedError));
        }
        req.user = user as User;
        next();
    })(req, res, next);
};

export default jwtAuthMiddleware;
