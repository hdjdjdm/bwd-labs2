import { NotFoundedError, ServerError } from '@utils/errors.js';
import Event from '@models/Event.js';
import User from '@models/User.js';
import EventDTO from '@dto/EventDTO.js';

class EventService {
    async createEvent(data: EventDTO): Promise<Event> {
        try {
            return await Event.create({
                title: data.title,
                description: data.description,
                date: data.date,
                createdBy: data.createdBy,
            });
        } catch (e: unknown) {
            if (e instanceof Error) {
                throw new ServerError('Error creating event: ' + e.message);
            } else {
                throw new ServerError('An unknown error occurred while creating the event.');
            }
        }
    }

    async getAllEvents(withDeleted: boolean): Promise<Event[]> {
        try {
            return await Event.findAll({
                paranoid: !withDeleted,
            });
        } catch (e: unknown) {
            if (e instanceof Error) {
                throw new ServerError('Error get events: ' + e.message);
            } else {
                throw new ServerError('An unknown error occurred while get the events.');
            }
        }
    }

    async getEvent(id: number): Promise<Event> {
        try {
            const event = await Event.findByPk(id, { paranoid: false });
            if (!event) {
                throw new NotFoundedError(`Event with ID ${id} not found.`);
            }

            return event;
        } catch (e: unknown) {
            if (e instanceof Error) {
                throw new ServerError('Error get event: ' + e.message);
            } else {
                throw new ServerError('An unknown error occurred while get the event.');
            }
        }
    }

    async getEventCreator(id: number): Promise<User> {
        try {
            const event = await Event.findByPk(id, { paranoid: false });
            if (!event) {
                throw new NotFoundedError(`Event with ID ${id} not found.`);
            }

            const user = await User.findByPk(event.createdBy);
            if (!user) {
                throw new NotFoundedError(`User with ID ${event.createdBy} not found.`);
            }

            return user;
        } catch (e: unknown) {
            if (e instanceof Error) {
                throw new ServerError('Error get event creator: ' + e.message);
            } else {
                throw new ServerError('An unknown error occurred while get event creator.');
            }
        }
    }

    async updateEvent(id: number, updateData: Partial<EventDTO>): Promise<Event> {
        try {
            const event = await Event.findByPk(id, { paranoid: false });
            if (!event) {
                throw new NotFoundedError(`Event with id ${id} not found`);
            }

            await event.update(updateData);
            return event;
        } catch (e: unknown) {
            if (e instanceof Error) {
                throw new ServerError('Error updating event: ' + e.message);
            } else {
                throw new ServerError('An unknown error occurred while updating the event.');
            }
        }
    }

    async deleteEvent(id: number, hardDelete: boolean = false): Promise<{ message: string }> {
        try {
            const event = await Event.findByPk(id, {
                paranoid: !hardDelete,
            });
            if (!event) {
                throw new NotFoundedError(`Event with id ${id} not found`);
            }

            await event.destroy({
                force: hardDelete,
            });
            return {
                message: `Event with id ${id} ${hardDelete ? 'permanently deleted' : 'deleted successfully'}`,
            };
        } catch (e: unknown) {
            if (e instanceof Error) {
                throw new ServerError('Error deleting event: ' + e.message);
            } else {
                throw new ServerError('An unknown error occurred while deleting the event.');
            }
        }
    }

    async restoreEvent(id: number): Promise<{ message: string }> {
        try {
            const event = await Event.findByPk(id, {
                paranoid: false,
            });
            if (!event) {
                throw new NotFoundedError(`Event with id ${id} not found`);
            }

            await event.restore();
            return {
                message: `Event with id ${id} restore successfully`,
            };
        } catch (e: unknown) {
            if (e instanceof Error) {
                throw new ServerError('Error restoring event: ' + e.message);
            } else {
                throw new ServerError('An unknown error occurred while restoring the event.');
            }
        }
    }
}

export default new EventService();
