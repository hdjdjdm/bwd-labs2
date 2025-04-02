import { NextFunction, Request, Response } from 'express';
import EventService from '@services/EventService.js';
import { Roles } from '@constants/Roles.js';
import User from '@models/User.js';
import CustomError from '@utils/CustomError.js';
import { ErrorCodes } from '@constants/Errors.js';
import { CreateEventDto, EventDto, UpdateEventDto } from '@dto/EventDto.js';
import EventMapper from '@mappers/EventMapper.js';

class EventController {
    async createEvent(req: Request, res: Response, next: NextFunction): Promise<void> {
        const { title, description, date, isPublic } = req.body as CreateEventDto;

        if (!title) {
            return next(new CustomError(ErrorCodes.BadRequest, 'Title are required'));
        }

        const eventDate = date ? new Date(date) : undefined;
        if (eventDate && isNaN(eventDate.getTime())) {
            return next(new CustomError(ErrorCodes.BadRequest, 'Invalid date format'));
        }

        try {
            EventController.validateEventData({ title, description, date: eventDate });
        } catch (e: unknown) {
            return next(e);
        }

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
            isPublic,
        });
        res.status(201).json(EventMapper.toResponseDto(event));
    }

    async getAllEvents(req: Request, res: Response, next: NextFunction) {
        try {
            const withDeleted = ['true', '1', 'yes'].includes(String(req.query.withDeleted).toLowerCase());
            const events = await EventService.getAllEvents(withDeleted);
            const responseData = events.map((event) => EventMapper.toResponseDto(event));
            res.status(200).json(responseData);
        } catch (e) {
            next(e);
        }
    }

    async getPublicEvents(req: Request, res: Response, next: NextFunction) {
        try {
            const withDeleted = ['true', '1', 'yes'].includes(String(req.query.withDeleted).toLowerCase());
            const events = await EventService.getPublicEvents(withDeleted);
            const responseData = events.map((event) => EventMapper.toResponseDto(event));
            res.status(200).json(responseData);
        } catch (e) {
            next(e);
        }
    }

    async getUserEvents(req: Request, res: Response, next: NextFunction) {
        try {
            const user = req.user as User;
            const withDeleted = ['true', '1', 'yes'].includes(String(req.query.withDeleted).toLowerCase());
            const events = await EventService.getUserEvents(user.id, withDeleted);
            const responseData = events.map((event) => EventMapper.toResponseDto(event));
            res.status(200).json(responseData);
        } catch (e) {
            next(e);
        }
    }

    async getEvent(req: Request, res: Response, next: NextFunction) {
        try {
            const id = Number(req.params.id);

            EventController.validateEventId(id);

            const event = await EventService.getEvent(id);
            res.status(200).json(EventMapper.toResponseDto(event));
        } catch (e) {
            next(e);
        }
    }

    async updateEvent(req: Request, res: Response, next: NextFunction) {
        try {
            const id = Number(req.params.id);
            const eventData: Partial<UpdateEventDto> = req.body;

            try {
                EventController.validateEventId(id);
                EventController.validateEventData(eventData);
            } catch (e: unknown) {
                return next(e);
            }

            if (!(await EventController.checkAccessToEvent(id, req.user as User))) {
                return next(
                    new CustomError(ErrorCodes.ForbiddenError, 'You do not have permission to access this resource.'),
                );
            }

            const updatedEvent = await EventService.updateEvent(id, eventData);
            res.status(200).json(EventMapper.toResponseDto(updatedEvent));
        } catch (e) {
            next(e);
        }
    }

    async deleteEvent(req: Request, res: Response, next: NextFunction) {
        try {
            const id = Number(req.params.id);

            const hardDelete = ['true', '1', 'yes'].includes(String(req.query.withDeleted).toLowerCase());

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

    private static validateEventData(data: Partial<EventDto>): void {
        if (data.createdBy !== undefined) {
            if (!Number.isInteger(data.createdBy) || data.createdBy <= 0) {
                throw new CustomError(ErrorCodes.BadRequest, 'Creator ID must be a positive integer.');
            }
        }

        if (typeof data.title === 'string') {
            data.title = data.title.trim();

            if (data.title === '') {
                throw new CustomError(ErrorCodes.BadRequest, 'Title must be a non-empty string.');
            }

            if (data.title.length > 100) {
                throw new CustomError(ErrorCodes.BadRequest, 'Title must not exceed 100 characters.');
            }
        }

        if (typeof data.description === 'string') {
            data.description = data.description.trim();

            if (data.description.length > 200) {
                throw new CustomError(ErrorCodes.BadRequest, 'Description must not exceed 200 characters.');
            }
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
