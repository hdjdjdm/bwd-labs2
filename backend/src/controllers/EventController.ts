import { NextFunction, Request, Response } from 'express';
import EventService from '@services/EventService.js';
import { Roles } from '@constants/Roles.js';
import User from '@models/User.js';
import CustomError from '@utils/CustomError.js';
import { ErrorCodes, ErrorMessages } from '@constants/Errors.js';
import EventMapper from '@mappers/EventMapper.js';
import { CreateEventInput, createEventSchema, getUpdateEventSchema, UpdateEventInput } from '@validation/event.js';
import { idSchema } from '@validation/user.js';

class EventController {
    async createEvent(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const data: CreateEventInput = createEventSchema.parse(req.body);
            const user = req.user as User;
            const createdBy = user.id;
            if (!createdBy) {
                return next(new CustomError(ErrorCodes.BadRequest, `Пользователь с id "${data.createdBy}" не найден`));
            }

            const event = await EventService.createEvent(data);
            res.status(201).json(EventMapper.toResponseDto(event));
        } catch (e) {
            return next(e);
        }
    }

    async getAllEvents(req: Request, res: Response, next: NextFunction) {
        try {
            const events = await EventService.getAllEvents();
            const responseData = events.map((event) => EventMapper.toResponseDto(event));
            res.status(200).json(responseData);
        } catch (e) {
            next(e);
        }
    }

    async getPublicEvents(req: Request, res: Response, next: NextFunction) {
        try {
            const events = await EventService.getPublicEvents();
            const responseData = events.map((event) => EventMapper.toResponseDto(event));
            res.status(200).json(responseData);
        } catch (e) {
            next(e);
        }
    }

    async getEvent(req: Request, res: Response, next: NextFunction) {
        try {
            const id = idSchema.parse(req.params.id);

            const event = await EventService.getEvent(id);
            res.status(200).json(EventMapper.toResponseDto(event));
        } catch (e) {
            next(e);
        }
    }

    async updateEvent(req: Request, res: Response, next: NextFunction) {
        try {
            const id = idSchema.parse(req.params.id);
            const event = await EventService.getEvent(id);
            const minDate = event.date.toISOString();
            const updateEventSchema = getUpdateEventSchema(minDate);
            const eventData: UpdateEventInput = updateEventSchema.parse(req.body);

            if (!(await EventController.checkAccessToEvent(id, req.user as User))) {
                return next(new CustomError(ErrorCodes.ForbiddenError, ErrorMessages.ForbiddenError));
            }

            const updatedEvent = await EventService.updateEvent(id, eventData);
            res.status(200).json(EventMapper.toResponseDto(updatedEvent));
        } catch (e) {
            next(e);
        }
    }

    async deleteEvent(req: Request, res: Response, next: NextFunction) {
        try {
            const id = idSchema.parse(req.params.id);
            const hardDelete = ['true', '1', 'yes'].includes(String(req.query.hardDelete).toLowerCase());

            if (!(await EventController.checkAccessToEvent(id, req.user as User))) {
                return next(new CustomError(ErrorCodes.ForbiddenError, ErrorMessages.ForbiddenError));
            }

            const { message, event } = await EventService.deleteEvent(id, hardDelete);
            res.status(200).json({ message: message, event: event ? EventMapper.toResponseDto(event) : null });
        } catch (e) {
            next(e);
        }
    }

    async restoreEvent(req: Request, res: Response, next: NextFunction) {
        try {
            const id = idSchema.parse(req.params.id);

            if (!(await EventController.checkAccessToEvent(id, req.user as User))) {
                return next(new CustomError(ErrorCodes.ForbiddenError, ErrorMessages.ForbiddenError));
            }

            const { message, event } = await EventService.restoreEvent(id);
            res.status(200).json({ message: message, event: EventMapper.toResponseDto(event) });
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
}

export default new EventController();
