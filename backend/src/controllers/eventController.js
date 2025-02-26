import EventService from "../services/eventService.js";
import UserService from "../services/userService.js";
import { ValidError, NotFoundedError } from "../utils/errors.js";

class EventController {
    static async createEvent(req, res, next) {
        try {
            const { title, description, date, createdBy } = req.body;
            
            if (!title || !createdBy) {
                throw new ValidError('Title and creator are required');
            }

            if (typeof title !== 'string' || title.trim() === '') {
                throw new ValidError('Title must be a non-empty string');
            }

            if (description && typeof description !== 'string') {
                throw new ValidError('Description must be a string');
            }

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

            const event = await EventService.createEvent({ title, description, date, createdBy });
            return res.status(201).json(event);
        } catch (e) {
            next(e);
        }
    }
    
    static async getAllEvents(req, res, next) {
        try {
            const withDeleted = req.query.withDeleted === 'true' || req.query.withDeleted === '1';
            const events = await EventService.getAllEvents(withDeleted);
            res.status(200).json(events);
        } catch (e) {
            next(e);
        }
    };

    static async getEvent(req, res, next) {
        try {
            const id = Number(req.params.id);

            if (!Number.isInteger(id) || id <= 0) {
                throw new ValidError("Invalid event ID. It must be a positive integer.");
            }

            const event = await EventService.getEvent(id);
            res.status(200).json(event);
        } catch (e) {
            next(e);
        }
    };

    static async updateEvent(req, res, next) {
        try {
            const id = Number(req.params.id);
            const updateData = req.body;
    
            if (!Number.isInteger(id) || id <= 0) {
                throw new ValidError("Invalid event ID. It must be a positive integer.");
            }
    
            if (updateData.title !== undefined && (typeof updateData.title !== 'string' || updateData.title.trim() === '')) {
                throw new ValidError('Title must be a non-empty string.');
            }
    
            if (updateData.description !== undefined && typeof updateData.description !== 'string') {
                throw new ValidError('Description must be a string.');
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
            
            if (!Number.isInteger(id) || id <= 0) {
                throw new ValidError("Invalid event ID. It must be a positive integer.");
            }

            const result = await EventService.deleteEvent(id);
            return res.status(200).json(result);
        } catch (e) {
            next(e);
        }
    }

    static async restoreEvent(req, res, next) {
        try {
            const id = Number(req.params.id);

            if (!Number.isInteger(id) || id <= 0) {
                throw new ValidError("Invalid event ID. It must be a positive integer.");
            }

            const result = await EventService.restoreEvent(id);
            return res.status(200).json(result);
        } catch (e) {
            next(e);
        }
    }
}

export default EventController;