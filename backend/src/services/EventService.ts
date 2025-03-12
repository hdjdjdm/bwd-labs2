import Event from '@models/Event.js';
import User from '@models/User.js';
import EventDTO from '@dto/EventDTO.js';
import CustomError from '@utils/CustomError.js';
import { ErrorCodes } from '@constants/Errors.js';

class EventService {
    async createEvent(data: EventDTO): Promise<Event> {
        return await Event.create({
            title: data.title,
            description: data.description,
            date: data.date,
            createdBy: data.createdBy,
        });
    }

    async getAllEvents(withDeleted: boolean): Promise<Event[]> {
        return await Event.findAll({
            paranoid: !withDeleted,
        });
    }

    async getEvent(id: number): Promise<Event> {
        const event = await Event.findByPk(id, { paranoid: false });
        if (!event) {
            throw new CustomError(ErrorCodes.NotFoundedError, `Event with ID ${id} not found.`);
        }

        return event;
    }

    async getEventCreator(id: number): Promise<User> {
        const event = await Event.findByPk(id, { paranoid: false });
        if (!event) {
            throw new CustomError(ErrorCodes.NotFoundedError, `Event with ID ${id} not found.`);
        }

        const user = await User.findByPk(event.createdBy);
        if (!user) {
            throw new CustomError(ErrorCodes.NotFoundedError, `User with ID ${event.createdBy} not found.`);
        }

        return user;
    }

    async updateEvent(id: number, updateData: Partial<EventDTO>): Promise<Event> {
        const event = await Event.findByPk(id, { paranoid: false });
        if (!event) {
            throw new CustomError(ErrorCodes.NotFoundedError, `Event with id ${id} not found`);
        }

        await event.update(updateData);
        return event;
    }

    async deleteEvent(id: number, hardDelete: boolean = false): Promise<{ message: string }> {
        const event = await Event.findByPk(id, {
            paranoid: !hardDelete,
        });
        if (!event) {
            throw new CustomError(ErrorCodes.NotFoundedError, `Event with id ${id} not found`);
        }

        await event.destroy({
            force: hardDelete,
        });
        return {
            message: `Event with id ${id} ${hardDelete ? 'permanently deleted' : 'deleted successfully'}`,
        };
    }

    async restoreEvent(id: number): Promise<{ message: string }> {
        const event = await Event.findByPk(id, {
            paranoid: false,
        });
        if (!event) {
            throw new CustomError(ErrorCodes.NotFoundedError, `Event with id ${id} not found`);
        }

        await event.restore();
        return {
            message: `Event with id ${id} restore successfully`,
        };
    }
}

export default new EventService();
