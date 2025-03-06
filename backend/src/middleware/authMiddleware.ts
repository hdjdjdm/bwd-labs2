import { Request, Response, NextFunction } from 'express';
import { ForbiddenError } from '@utils/errors';
import { Roles } from '@constants/Roles';

const checkRole = (requiredRole: Roles) => async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as { role: Roles };
    if (!user || user.role !== requiredRole) {
        return next(new ForbiddenError('You do not have permission to access this resource.'));
    }
    next();
};

export { checkRole };
