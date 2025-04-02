import Event from '@models/Event.js';
import User from '@models/User.js';
import CustomError from '@utils/CustomError.js';
import { ErrorCodes } from '@constants/Errors.js';
import { CreateEventDto, UpdateEventDto } from '@dto/EventDto.js';

class EventService {
    async createEvent(data: CreateEventDto): Promise<Event> {
        const event = await Event.create({
            title: data.title,
            description: data.description,
            date: data.date,
            createdBy: data.createdBy,
            isPublic: data.isPublic,
        });

        return this.getEvent(event.id);
    }

    async getAllEvents(withDeleted: boolean): Promise<Event[]> {
        return await Event.findAll({
            paranoid: !withDeleted,
            include: [
                {
                    model: User,
                    as: 'creator',
                },
            ],
        });
    }

    async getEvent(id: number): Promise<Event> {
        return await Event.findByPk(id, {
            paranoid: false,
            rejectOnEmpty: new CustomError(ErrorCodes.NotFoundedError, `Event with ID ${id} not found.`),
            include: [
                {
                    model: User,
                    as: 'creator',
                },
            ],
        });
    }

    async getEventCreator(id: number): Promise<User> {
        const event = await this.getEvent(id);

        return await User.findByPk(event.createdBy, {
            rejectOnEmpty: new CustomError(ErrorCodes.NotFoundedError, `User with ID ${event.createdBy} not found.`),
        });
    }

    async updateEvent(id: number, updateData: Partial<UpdateEventDto>): Promise<Event> {
        const event = await this.getEvent(id);

        await event.update(updateData);
        return this.getEvent(event.id);
    }

    async deleteEvent(id: number, hardDelete: boolean = false): Promise<{ message: string }> {
        const event = await this.getEvent(id);

        await event.destroy({
            force: hardDelete,
        });
        return {
            message: `Event with id ${id} ${hardDelete ? 'permanently deleted' : 'deleted successfully'}`,
        };
    }

    async restoreEvent(id: number): Promise<{ message: string }> {
        const event = await this.getEvent(id);

        await event.restore();
        return {
            message: `Event with id ${id} restore successfully`,
        };
    }
}

export default new EventService();
