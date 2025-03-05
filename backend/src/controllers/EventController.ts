import { Request, Response, NextFunction } from 'express';
import EventService from '../services/EventService';
import UserService from '../services/UserService';
import { ValidError, ForbiddenError } from '../utils/errors';
import { Roles } from '../constants/Roles';
import User from '../models/User';

interface CreateEventBody {
    title: string;
    description?: string;
    date?: Date;
    createdBy: number;
}

interface EventData {
    createdBy?: number;
    title?: string;
    description?: string;
    date?: Date;
}

class EventController {
    static async createEvent(req: Request, res: Response, next: NextFunction) {
        try {
            const { title, description, date, createdBy }: CreateEventBody = req.body;

            if (!title || !createdBy) {
                throw new ValidError('Title and creator are required');
            }

            EventController.validateEventData({ title, description, createdBy, date });

            const user = await UserService.getUser(createdBy);
            if (!user) {
                throw new ValidError(`User with the ID ${createdBy} not found`);
            }

            const event = await EventService.createEvent({
                title,
                description,
                date,
                createdBy,
            });
            res.status(201).json(event);
        } catch (e) {
            next(e);
        }
    }

    static async getAllEvents(req: Request, res: Response, next: NextFunction) {
        try {
            const withDeleted = req.query.withDeleted === 'true' || req.query.withDeleted === '1';
            const events = await EventService.getAllEvents(withDeleted);
            res.status(200).json(events);
        } catch (e) {
            next(e);
        }
    }

    static async getEvent(req: Request, res: Response, next: NextFunction) {
        try {
            const id = Number(req.params.id);

            EventController.validateEventId(id);

            const event = await EventService.getEvent(id);
            res.status(200).json(event);
        } catch (e) {
            next(e);
        }
    }

    static async updateEvent(req: Request, res: Response, next: NextFunction) {
        try {
            const id = Number(req.params.id);

            EventController.validateEventId(id);
            EventController.validateEventData(req.body);

            if (!(await EventController.checkAccessUser(id, req.user as User))) {
                return next(new ForbiddenError('You do not have permission to access this resource.'));
            }

            const updatedEvent = await EventService.updateEvent(id, req.body);
            res.status(200).json(updatedEvent);
        } catch (e) {
            next(e);
        }
    }

    static async deleteEvent(req: Request, res: Response, next: NextFunction) {
        try {
            const id = Number(req.params.id);

            const hardDelete = req.query.hardDelete === 'true' || req.query.hardDelete === '1';

            EventController.validateEventId(id);

            if (!(await EventController.checkAccessUser(id, req.user as User))) {
                return next(new ForbiddenError('You do not have permission to access this resource.'));
            }

            const result = await EventService.deleteEvent(id, hardDelete);
            res.status(200).json(result);
        } catch (e) {
            next(e);
        }
    }

    static async restoreEvent(req: Request, res: Response, next: NextFunction) {
        try {
            const id = Number(req.params.id);

            EventController.validateEventId(id);

            if (!(await EventController.checkAccessUser(id, req.user as User))) {
                return next(new ForbiddenError('You do not have permission to access this resource.'));
            }

            const result = await EventService.restoreEvent(id);
            res.status(200).json(result);
        } catch (e) {
            next(e);
        }
    }

    static async checkAccessUser(id: number, user: User): Promise<boolean> {
        if (user.role === Roles.ADMIN) return true;

        const creator: User = await EventService.getEventCreator(id);
        return creator.id === user.id;
    }

    static validateEventId(id: number): void {
        if (!Number.isInteger(id) || id <= 0) {
            throw new ValidError('Invalid event ID. It must be a positive integer.');
        }
    }

    static validateEventData(data: EventData): void {
        if (data.createdBy) {
            if (!Number.isInteger(data.createdBy) || data.createdBy <= 0) {
                throw new ValidError('Creator ID must be a positive integer.');
            }
        }

        if (data.title) {
            if (data.title.trim() === '') {
                throw new ValidError('Title must be a non-empty string.');
            }
            data.title = data.title.trim();
        }

        if (data.description) {
            data.description = data.description.trim();
            if (data.description === '') {
                throw new ValidError('Description must not be an empty string.');
            }
        }

        if (data.date) {
            if (isNaN(data.date.getTime())) {
                throw new ValidError('Invalid date format.');
            }
        }
    }
}

export default EventController;
//todo как то можно было создать объект, что бы не писать static (вроде new не помню)
