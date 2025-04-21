import { NextFunction, Request, Response } from 'express';
import UserService from '@services/UserService.js';
import { Roles } from '@constants/Roles.js';
import CustomError from '@utils/CustomError.js';
import { ErrorCodes, ErrorMessages } from '@constants/Errors.js';
import { ChangeUserRoleDto, UserDto } from '@dto/UserDto.js';
import UserMapper from '@mappers/UserMapper.js';
import User from '@models/User.js';

class UserController {
    async getAllUsers(req: Request, res: Response, next: NextFunction) {
        try {
            const withDeleted = req.query.withDeleted === 'true' || req.query.withDeleted === '1';
            const users = await UserService.getAllUsers(withDeleted);
            const responseData = users.map((user) => UserMapper.toResponseDto(user));
            res.status(200).json(responseData);
        } catch (e) {
            next(e);
        }
    }

    async getUser(req: Request, res: Response, next: NextFunction) {
        try {
            const requester = req.user as User;
            const id = Number(req.params.id);
            let sendDeletedEvents = false;

            UserController.validateUserId(id);

            if (requester.id === id || requester.role === 'admin') {
                sendDeletedEvents = true;
            }
            const user = await UserService.getUser(id, sendDeletedEvents);
            res.status(200).json(UserMapper.toResponseDto(user));
        } catch (e) {
            next(e);
        }
    }

    async updateUser(req: Request, res: Response, next: NextFunction) {
        try {
            const user = req.user as User;
            const id = Number(req.params.id);
            const userData: Partial<UserDto> = req.body;

            UserController.validateUserId(id);
            UserController.validateUserData(userData);

            if (user.id !== id) {
                return next(new CustomError(ErrorCodes.ForbiddenError, ErrorMessages.ForbiddenError));
            }

            const updatedUser = await UserService.updateUser(id, userData);
            res.status(200).json(UserMapper.toResponseDto(updatedUser));
        } catch (e) {
            next(e);
        }
    }

    async deleteUser(req: Request, res: Response, next: NextFunction) {
        try {
            const requester = req.user as User;
            const id = Number(req.params.id);
            const hardDelete = req.query.hardDelete === 'true' || req.query.hardDelete === '1';

            UserController.validateUserId(id);

            if (requester.id !== id || requester.role !== 'admin') {
                return next(new CustomError(ErrorCodes.ForbiddenError, ErrorMessages.ForbiddenError));
            }
            UserController.validateUserId(id);

            const result = await UserService.deleteUser(id, hardDelete);
            res.status(200).json(result);
        } catch (e) {
            next(e);
        }
    }

    async restoreUser(req: Request, res: Response, next: NextFunction) {
        try {
            const requester = req.user as User;
            const id = Number(req.params.id);

            UserController.validateUserId(id);

            if (requester.id !== id || requester.role !== 'admin') {
                return next(new CustomError(ErrorCodes.ForbiddenError, ErrorMessages.ForbiddenError));
            }

            const result = await UserService.restoreUser(id);
            res.status(200).json(result);
        } catch (e) {
            next(e);
        }
    }

    async getUserRole(req: Request, res: Response, next: NextFunction) {
        try {
            const id = Number(req.params.id);

            UserController.validateUserId(id);

            const role = await UserService.getUserRole(id);
            res.status(200).json(role);
        } catch (e) {
            next(e);
        }
    }

    async setUserRole(req: Request, res: Response, next: NextFunction): Promise<void> {
        const id = Number(req.params.id);
        const { role } = req.body as ChangeUserRoleDto;

        try {
            UserController.validateUserId(id);
        } catch (e) {
            next(e);
        }

        if (!role || !Object.values(Roles).includes(role)) {
            return next(
                new CustomError(
                    ErrorCodes.BadRequest,
                    `Invalid or missing role. Allowed roles are: ${Object.values(Roles).join(', ')}`,
                ),
            );
        }

        const user = await UserService.setUserRole(id, role);
        res.status(200).json(user);
    }

    private static validateUserId(id: number): void {
        if (!Number.isInteger(id) || id <= 0) {
            throw new CustomError(ErrorCodes.BadRequest, 'Invalid user ID. It must be a positive integer.');
        }
    }

    private static validateUserData(data: Partial<UserDto>): void {
        if (typeof data.name === 'string') {
            data.name = data.name.trim();

            if (data.name === '') {
                throw new CustomError(ErrorCodes.BadRequest, 'Name must be a non-empty string.');
            }

            if (data.name.length > 30) {
                throw new CustomError(ErrorCodes.BadRequest, 'Name must not exceed 30 characters.');
            }
        }
    }
}

export default new UserController();
