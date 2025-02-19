const EventService = require("../services/eventService");
const { ValidationError, NotFoundError } = require("../utils/errors");

class EventController {
    static async createEvent(req, res, next) {
        try {
            const { title, createdBy } = req.body;
            if (!title || !createdBy) {
                throw new ValidationError('Title and creator are required');
            }

            const user = await EventService.createEvent({ title, createdBy });
            return res.status(201).json(user);
        } catch (e) {
            next(e);
        }
    }
    
    static async getAllEvents(req, res, next) {
        try {
            const includeDeleted = req.query.includeDeleted === 'true';
            const users = await EventService.getAllEvents(includeDeleted);
            res.status(200).json(users);
        } catch (e) {
            next(e);
        }
    };

    static async getEvent(req, res, next) {
        try {
            const { id } = req.params;
            const event = await EventService.getEvent(id);

            if (!event) {
                throw new NotFoundError(`Event with id ${id} not found`);
            }

            res.status(200).json(event);
        } catch (e) {
            next(e);
        }
    };

    static async updateEvent(req, res, next) {
        try {
            const { id } = req.params;
            const updateData = req.body;

            if (!Object.keys(updateData).length) {
                throw new ValidationError('No data provided for update');
            }

            const updatedEvent = await EventService.updateEvent(id, updateData);
            return res.status(200).json(updatedEvent);
        } catch (e) {
            next(e);
        }
    }

    static async deleteEvent(req, res, next) {
        try {
            const { id } = req.params;
            const result = await EventService.deleteEvent(id);
            return res.status(200).json(result);
        } catch (e) {
            next(e);
        }
    }

    static async restoreEvent(req, res, next) {
        try {
            const { id } = req.params;
            const result = await EventService.restoreEvent(id);
            return res.status(200).json(result);
        } catch (e) {
            next(e);
        }
    }
}

module.exports = EventController;