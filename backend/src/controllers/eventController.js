const { error } = require("console");
const EventService = require("../services/eventService");

class EventController {
    static async createEvent(req, res) {
        try {
            const { title, createdBy } = req.body;
            if (!title || !createdBy) {
                return res.status(400).json({ message: 'Title and creator required!' })
            }

            const user = await EventService.createEvent({ title, createdBy });
            return res.status(201).json(user);
        } catch (e) {
            return res.status(500).json({ message: e.message });
        }
    }
    
    static async getAllEvents(req, res) {
        try {
            const users = await EventService.getAllEvents();
            res.status(200).json(users);
        } catch (e) {
            res.status(500).json({ message: e.message });
        }
    };

    static async getEvent(req, res) {
        try {
            const { id } = req.params;
            const event = await EventService.getEvent(id);

            if (!event) {
                return res.status(404).json({ message: `Event with id ${id} not found` });
            }

            res.status(200).json(event);
        } catch (e) {
            res.status(500).json({ message: e.message });
        }
    };

    static async updateEvent(req, res) {
        try {
            const { id } = req.params;
            const updateData = req.body;

            if (!Object.keys(updateData).length) {
                return res.status(400).json({ message: 'No data for update' });
            }

            const updatedEvent = await EventService.updateEvent(id, updateData);
            return res.status(200).json(updatedEvent);
        } catch (e) {
            return res.status(500).json({ message: e.message });
        }
    }

    static async deleteEvent(req, res) {
        try {
            const { id } = req.params;
            const result = await EventService.deleteEvent(id);
            return res.status(200).json(result);
        } catch (e) {
            return res.status(500).json({ message: e.message });
        }
    }
}

module.exports = EventController;