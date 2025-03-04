import ROLES from '../constants/roles.js';
import EventService from '../services/eventService.js';
import UserService from '../services/userService.js';
import { ValidError, ForbiddenError } from '../utils/errors.js';

class EventController {
    static async createEvent(req, res, next) {
        try {
            let { title, description, date, createdBy } = req.body;

            if (!title || !createdBy) {
                throw new ValidError('Title and creator are required');
            }

            if (typeof title !== 'string' || title.trim() === '') {
                throw new ValidError('Title must be a non-empty string');
            }
            title = title.trim();

            if (description && typeof description !== 'string') {
                throw new ValidError('Description must be a string');
            }
            description = description.trim();

            if (date) {
                const parsedDate = Date.parse(date);
                if (isNaN(parsedDate)) {
                    throw new ValidError('Invalid date format');
                }
            }

            if (!Number.isInteger(createdBy) || createdBy <= 0) {
                throw new ValidError('Creator ID must be a positive integer');
            }

            const user = await UserService.getUser(createdBy);
            if (!user) {
                throw new ValidError(`User with the ID ${createdBy} not found`);
            }

            const event = await EventService.createEvent({
                title,
                description,
                date,
                createdBy,
            });
            return res.status(201).json(event);
        } catch (e) {
            next(e);
        }
    }

    static async getAllEvents(req, res, next) {
        try {
            const withDeleted =
                req.query.hardDelete === 'true' || req.query.hardDelete === '1';
            const events = await EventService.getAllEvents(withDeleted);
            res.status(200).json(events);
        } catch (e) {
            next(e);
        }
    }

    static async getEvent(req, res, next) {
        try {
            const id = Number(req.params.id);

            if (!Number.isInteger(id) || id <= 0) {
                throw new ValidError(
                    'Invalid event ID. It must be a positive integer.',
                );
            }

            const event = await EventService.getEvent(id);
            res.status(200).json(event);
        } catch (e) {
            next(e);
        }
    }

    static async updateEvent(req, res, next) {
        try {
            const id = Number(req.params.id);
            const updateData = req.body;

            if (!Number.isInteger(id) || id <= 0) {
                throw new ValidError(
                    'Invalid event ID. It must be a positive integer.',
                );
            }

            if (!EventController.checkAccessUser(id, req.user)) {
                return next(
                    new ForbiddenError(
                        'You do not have permission to access this resource.',
                    ),
                );
            }

            const allowedFields = ['title', 'description', 'date'];
            for (const key in updateData) {
                if (!allowedFields.includes(key)) {
                    throw new ValidError(`Field '${key}' cannot be updated.`);
                }
            }

            if (updateData.title != null) {
                if (
                    typeof updateData.title !== 'string' ||
                    updateData.title.trim() === ''
                ) {
                    throw new ValidError('Title must be a non-empty string.');
                }
                updateData.title = updateData.title.trim();
            } else {
                delete updateData.title;
            }

            if (updateData.description) {
                if (typeof updateData.description !== 'string') {
                    throw new ValidError('Description must be a string.');
                }
                updateData.description = updateData.description.trim();
                if (updateData.description === '') {
                    throw new ValidError(
                        'Description must not be an empty string.',
                    );
                }
            }

            if (updateData.date) {
                const parsedDate = Date.parse(updateData.date);
                if (isNaN(parsedDate)) {
                    throw new ValidError('Invalid date format.');
                }
            }

            const updatedEvent = await EventService.updateEvent(id, updateData);
            return res.status(200).json(updatedEvent);
        } catch (e) {
            next(e);
        }
    }

    static async deleteEvent(req, res, next) {
        try {
            const id = Number(req.params.id);

            const hardDelete =
                req.query.withDeleted === 'true' ||
                req.query.withDeleted === '1';

            if (!Number.isInteger(id) || id <= 0) {
                throw new ValidError(
                    'Invalid event ID. It must be a positive integer.',
                );
            }

            if (!EventController.checkAccessUser(id, req.user)) {
                return next(
                    new ForbiddenError(
                        'You do not have permission to access this resource.',
                    ),
                );
            }

            const result = await EventService.deleteEvent(id, hardDelete);
            return res.status(200).json(result);
        } catch (e) {
            next(e);
        }
    }

    static async restoreEvent(req, res, next) {
        try {
            const id = Number(req.params.id);

            if (!Number.isInteger(id) || id <= 0) {
                throw new ValidError(
                    'Invalid event ID. It must be a positive integer.',
                );
            }

            if (!EventController.checkAccessUser(id, req.user)) {
                return next(
                    new ForbiddenError(
                        'You do not have permission to access this resource.',
                    ),
                );
            }

            const result = await EventService.restoreEvent(id);
            return res.status(200).json(result);
        } catch (e) {
            next(e);
        }
    }

    static async checkAccessUser(id, user) {
        if (user.role !== ROLES.ADMIN) {
            const event = await EventService.getEvent(id);
            if (event.createdBy !== user.id) {
                return false;
            }
        }

        return true;
    }
}

export default EventController;
