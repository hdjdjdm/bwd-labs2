import passport from 'passport';
import { Request, Response, NextFunction } from 'express';
import { UnauthorizedError } from '../utils/errors';
import User from '../models/User';

const jwtAuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate('jwt', { session: false }, (err: Error | null, user: User | false) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return next(new UnauthorizedError());
        }
        req.user = user;
        next();
    })(req, res, next);
};

export default jwtAuthMiddleware;
