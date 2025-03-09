import { Request, Response, NextFunction } from 'express';
import EventService from '@services/EventService.js';
import UserService from '@services/UserService.js';
import { ValidError, ForbiddenError } from '@utils/errors.js';
import { Roles } from '@constants/Roles.js';
import User from '@models/User.js';
import EventDTO from '@dto/EventDTO.js';

class EventController {
    async createEvent(req: Request, res: Response) {
        const { title, description, date, createdBy }: EventDTO = req.body;

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
    }

    async getAllEvents(req: Request, res: Response, next: NextFunction) {
        try {
            const withDeleted = req.query.withDeleted === 'true' || req.query.withDeleted === '1';
            const events = await EventService.getAllEvents(withDeleted);
            res.status(200).json(events);
        } catch (e) {
            next(e);
        }
    }

    async getEvent(req: Request, res: Response, next: NextFunction) {
        try {
            const id = Number(req.params.id);

            EventController.validateEventId(id);

            const event = await EventService.getEvent(id);
            res.status(200).json(event);
        } catch (e) {
            next(e);
        }
    }

    async updateEvent(req: Request, res: Response, next: NextFunction) {
        try {
            const id = Number(req.params.id);

            EventController.validateEventId(id);
            EventController.validateEventData(req.body);

            if (!(await EventController.checkAccessToEvent(id, req.user as User))) {
                return next(new ForbiddenError('You do not have permission to access this resource.'));
            }

            const updatedEvent = await EventService.updateEvent(id, req.body);
            res.status(200).json(updatedEvent);
        } catch (e) {
            next(e);
        }
    }

    async deleteEvent(req: Request, res: Response, next: NextFunction) {
        try {
            const id = Number(req.params.id);

            const hardDelete = req.query.hardDelete === 'true' || req.query.hardDelete === '1';

            EventController.validateEventId(id);

            if (!(await EventController.checkAccessToEvent(id, req.user as User))) {
                return next(new ForbiddenError('You do not have permission to access this resource.'));
            }

            const result = await EventService.deleteEvent(id, hardDelete);
            res.status(200).json(result);
        } catch (e) {
            next(e);
        }
    }

    async restoreEvent(req: Request, res: Response, next: NextFunction) {
        try {
            const id = Number(req.params.id);

            EventController.validateEventId(id);

            if (!(await EventController.checkAccessToEvent(id, req.user as User))) {
                return next(new ForbiddenError('You do not have permission to access this resource.'));
            }

            const result = await EventService.restoreEvent(id);
            res.status(200).json(result);
        } catch (e) {
            next(e);
        }
    }

    /**
     * Метод отвечает за проверку доступа пользователя к редактированию событий
     * @param {number} id - уникальный идентификатор пользователя
     * @param {User} user - обьект пользователя, которого нужно проверить
     *
     * @return {Promise<boolean>}
     */
    private static async checkAccessToEvent(id: number, user: User): Promise<boolean> {
        if (user.role === Roles.ADMIN) return true;

        const creator: User = await EventService.getEventCreator(id);
        return creator.id === user.id;
    }

    private static validateEventId(id: number): void {
        if (!Number.isInteger(id) || id <= 0) {
            throw new ValidError('Invalid event ID. It must be a positive integer.');
        }
    }

    private static validateEventData(data: Partial<EventDTO>): void {
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

        if (data.description !== undefined) {
            data.description = data.description.trim();
        }

        if (data.date) {
            if (isNaN(data.date.getTime())) {
                throw new ValidError('Invalid date format.');
            }
        }
    }
}

//todo мб обрабатывать ошибки не в сервисе, а в контроллере
export default new EventController();
