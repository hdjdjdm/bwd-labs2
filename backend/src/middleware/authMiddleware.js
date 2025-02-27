import EventService from '../services/eventService.js';
import { ForbiddenError, NotFoundedError } from '../utils/errors.js';

const checkLevelAccess = (requiredRoles = [], isEventOwnerCheck = false) => async (req, res, next) => {
    try {
        const userId = req.user.id;
        const userRole = req.user.role;

        if (isEventOwnerCheck) {
            const eventId = Number(req.params.id);
            const event = await EventService.getEvent(eventId);

            if (!event) {
                throw new NotFoundedError('Event not found.');
            }

            if (event.createdBy === userId) {
                return next();
            }
        }

        if (!requiredRoles.includes(userRole)) {
            return next(new ForbiddenError('You do not have permission to access this resource.'));
        }

        next();
    } catch (e) {
        next(e);
    }
};

export { checkLevelAccess };