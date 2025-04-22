import Event from '@models/Event.js';
import User from '@models/User.js';
import CustomError from '@utils/CustomError.js';
import { ErrorCodes } from '@constants/Errors.js';
import { CreateEventInput, UpdateEventInput } from '@validation/event.js';

class EventService {
    async createEvent(data: CreateEventInput): Promise<Event> {
        const event = await Event.create({
            title: data.title,
            description: data.description,
            date: data.date,
            createdBy: data.createdBy,
            isPublic: data.isPublic,
        });

        return this.getEvent(event.id);
    }

    async getAllEvents(): Promise<Event[]> {
        return await Event.findAll({
            paranoid: false,
            include: [
                {
                    model: User,
                    as: 'creator',
                },
            ],
        });
    }

    async getPublicEvents(): Promise<Event[]> {
        return await Event.findAll({
            where: { isPublic: true },
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
            rejectOnEmpty: new CustomError(ErrorCodes.NotFoundedError, `Событие с id "${id}" не найдено.`),
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
            rejectOnEmpty: new CustomError(
                ErrorCodes.NotFoundedError,
                `Пользователь с id "${event.createdBy}" не найден.`,
            ),
        });
    }

    async updateEvent(id: number, updateData: UpdateEventInput): Promise<Event> {
        const event = await this.getEvent(id);

        await event.update(updateData);
        return this.getEvent(event.id);
    }

    async deleteEvent(id: number, hardDelete: boolean = false): Promise<{ message: string; event: Event | null }> {
        const event = await this.getEvent(id);
        const eventTitle = event.title;

        await event.destroy({
            force: hardDelete,
        });

        let updatedEvent;
        if (!hardDelete) {
            updatedEvent = await this.getEvent(id);
        }

        return {
            message: `Событие ${eventTitle} ${hardDelete ? 'удалено' : 'перемещено в удаленные'}`,
            event: updatedEvent as Event | null,
        };
    }

    async restoreEvent(id: number): Promise<{ message: string; event: Event }> {
        const event = await this.getEvent(id);
        const eventTitle = event?.title;

        await event.restore();
        return {
            message: `Событие ${eventTitle} восстановлено`,
            event: event,
        };
    }
}

export default new EventService();
