import models from '../models/index.js';
import { NotFoundedError, ServerError } from '../utils/errors.js';
const { Event } = models;

class EventService {
    static async createEvent(data) {
        try {
            const event = await Event.create(data);
            return event;
        } catch (e) {
            throw new ServerError('Error creating event: ' + e.message);
        }
    }
    
    static async getAllEvents(withDeleted) {
        try {
            const events = await Event.findAll({
                paranoid: !withDeleted
            });

            return events;
        } catch (e) {
            throw new ServerError('Error get events: ' + e.message);
        }
    }

    static async getEvent(id) {
        try {
            const event = await Event.findByPk(id);
            if (!event) {
                throw new NotFoundedError(`Event with ID ${id} not found.`);
            }
            
            return event;
        } catch (e) {
            throw new ServerError('Error get event: ' + e.message);
        }
    }

    static async updateEvent(id, updateData) {
        try {
            const event = await Event.findByPk(id);
            if (!event) {
                throw new NotFoundedError(`Event with id ${id} not found`);
            }

            await event.update(updateData);
            return event;
        } catch (e) {
            throw new ServerError('Error updating event: ' + e.message);
        }
    }

    static async deleteEvent(id) {
        try {
            const event = await Event.findByPk(id);
            if (!event) {
                throw new NotFoundedError(`Event with id ${id} not found`);
            }
    
            await event.destroy();
            return { message: `Event with id ${id} deleted successfully` };
        } catch (e) {
            throw new ServerError('Error deleting event: ' + e.message);
        }
    }

    static async restoreEvent(id) {
        try {
            const event = await Event.findByPk(id, { paranoid: false });
            if (!event) {
                throw new NotFoundedError(`Event with id ${id} not found`);
            }
    
            await event.restore();
            return { message: `Event with id ${id} restore successfully` };
        } catch (e) {
            throw new ServerError('Error restoring event: ' + e.message);
        }
    }
}

export default EventService;