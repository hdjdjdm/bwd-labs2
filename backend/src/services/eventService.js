import Event from '../models/Event.js';

class EventService {
    static async createEvent(data) {
        try {
            const event = await Event.create(data);
            return event;
        } catch (e) {
            throw new Error('Error creating event: ' + e.message);
        }
    }
    
    static async getAllEvents(includeDeleted) {
        try {
            const events = await Event.findAll({
                paranoid: !includeDeleted
            });

            return events;
        } catch (e) {
            throw new Error('Error get events: ' + e.message);
        }
    }

    static async getEvent(id) {
        try {
            const event = await Event.findByPk(id);
            return event;
        } catch (e) {
            throw new Error('Error get events: ' + e.message);
        }
    }

    static async updateEvent(id, updateData) {
        try {
            const event = await Event.findByPk(id);
            if (!event) {
                throw new Error(`Event with id ${id} not found`);
            }

            await event.update(updateData);
            return event;
        } catch (e) {
            throw new Error('Error updating event: ' + e.message);
        }
    }

    static async deleteEvent(id) {
        try {
            const event = await Event.findByPk(id);
            if (!event) {
                throw new Error(`Event with id ${id} not found`);
            }
    
            await event.destroy();
            return { message: `Event with id ${id} deleted successfully` };
        } catch (e) {
            throw new Error('Error deleting event: ' + e.message);
        }
    }

    static async restoreEvent(id) {
        try {
            const event = await Event.findByPk(id, { paranoid: false });
            if (!event) {
                throw new Error(`Event with id ${id} not found`);
            }
    
            await event.restore();
            return { message: `Event with id ${id} restore successfully` };
        } catch (e) {
            throw new Error('Error restoring event: ' + e.message);
        }
    }
}

export default EventService;