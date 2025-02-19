const { Event } = require('../models');

class EventService {
    static async createEvent(data) {
        try {
            const event = await Event.create(data);
            return event;
        } catch (e) {
            throw new Error('Error creating event: ' + e.message);
        }
    }
    
    static async getAllEvents() {
        try {
            const events = await Event.findAll();
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
}

module.exports = EventService;