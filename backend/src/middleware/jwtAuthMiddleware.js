import passport from 'passport';
import { UnauthorizedError } from '../utils/errors.js';

const jwtAuthMiddleware = (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, user, info) => {
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
