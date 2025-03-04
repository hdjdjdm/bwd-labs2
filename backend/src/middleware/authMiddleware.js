import { ForbiddenError } from '../utils/errors.js';

const checkRole =
    (requiredRoles = []) =>
    async (req, res, next) => {
        if (!req.user || !requiredRoles.includes(req.user.role)) {
            return next(
                new ForbiddenError(
                    'You do not have permission to access this resource.',
                ),
            );
        }
        next();
    };

export { checkRole };
