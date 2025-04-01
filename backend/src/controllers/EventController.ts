import { NextFunction, Request, Response } from 'express';
import EventService from '@services/EventService.js';
import { Roles } from '@constants/Roles.js';
import User from '@models/User.js';
import EventDTO from '@dto/EventDTO.js';
import CustomError from '@utils/CustomError.js';
import { ErrorCodes } from '@constants/Errors.js';

class EventController {
    async createEvent(req: Request, res: Response, next: NextFunction): Promise<void> {
        const { title, description, date } = req.body as EventDTO;

        if (!title) {
            return next(new CustomError(ErrorCodes.BadRequest, 'Title are required'));
        }

        const eventDate = date ? new Date(date) : undefined;
        if (eventDate && isNaN(eventDate.getTime())) {
            return next(new CustomError(ErrorCodes.BadRequest, 'Invalid date format'));
        }

        EventController.validateEventData({ title, description, date: eventDate });

        const user = req.user as User;
        const createdBy = user.id;
        if (!createdBy) {
            return next(new CustomError(ErrorCodes.BadRequest, `User with the ID ${createdBy} not found`));
        }

        const event = await EventService.createEvent({
            title,
            description,
            date: eventDate,
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
            const eventData: Partial<EventDTO> = req.body;

            EventController.validateEventId(id);
            EventController.validateEventData(eventData);

            if (!(await EventController.checkAccessToEvent(id, req.user as User))) {
                return next(
                    new CustomError(ErrorCodes.ForbiddenError, 'You do not have permission to access this resource.'),
                );
            }

            const updatedEvent = await EventService.updateEvent(id, eventData);
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
                return next(
                    new CustomError(ErrorCodes.ForbiddenError, 'You do not have permission to access this resource.'),
                );
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
                return next(
                    new CustomError(ErrorCodes.ForbiddenError, 'You do not have permission to access this resource.'),
                );
            }

            const result = await EventService.restoreEvent(id);
            res.status(200).json(result);
        } catch (e) {
            next(e);
        }
    }

    /**
     * Метод отвечает за проверку доступа пользователя к редактированию событий
     * @param {number} id - уникальный идентификатор события
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
            throw new CustomError(ErrorCodes.BadRequest, 'Invalid event ID. It must be a positive integer.');
        }
    }

    private static validateEventData(data: Partial<EventDTO>): void {
        if (data.createdBy !== undefined) {
            if (!Number.isInteger(data.createdBy) || data.createdBy <= 0) {
                throw new CustomError(ErrorCodes.BadRequest, 'Creator ID must be a positive integer.');
            }
        }

        if (typeof data.title === 'string') {
            if (data.title.trim() === '') {
                throw new CustomError(ErrorCodes.BadRequest, 'Title must be a non-empty string.');
            }
            data.title = data.title.trim();
        }

        if (typeof data.description === 'string') {
            data.description = data.description.trim();
        }

        if (data.date !== undefined) {
            const parsedDate = new Date(data.date);

            if (isNaN(parsedDate.getTime())) {
                throw new CustomError(ErrorCodes.BadRequest, 'Invalid date format.');
            }
            data.date = parsedDate;
        }
    }
}

export default new EventController();
