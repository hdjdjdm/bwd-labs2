import { NextFunction, Request, Response } from 'express';
import UserService from '@services/UserService.js';
import { Roles } from '@constants/Roles.js';
import CustomError from '@utils/CustomError.js';
import { ErrorCodes, ErrorMessages } from '@constants/Errors.js';
import UserMapper from '@mappers/UserMapper.js';
import User from '@models/User.js';
import { roleSchema, UpdateUserInput, updateUserSchema, idSchema } from '@validation/user.js';

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
            const id = idSchema.parse(req.params.id);
            let sendDeletedEvents = false;

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
            const currentUser = req.user as User;
            const targetUserId = idSchema.parse(req.params.id);
            const userData: UpdateUserInput = updateUserSchema.parse(req.body);
            if (currentUser.id !== targetUserId && currentUser.role !== 'admin') {
                return next(new CustomError(ErrorCodes.ForbiddenError, ErrorMessages.ForbiddenError));
            }
            if (currentUser.role !== 'admin' && userData.role && userData.role !== currentUser.role) {
                return next(new CustomError(ErrorCodes.ForbiddenError, 'Вы не можете изменить свою роль.'));
            }

            const updatedUser = await UserService.updateUser(targetUserId, userData);
            res.status(200).json(UserMapper.toResponseDto(updatedUser));
        } catch (e) {
            next(e);
        }
    }

    async deleteUser(req: Request, res: Response, next: NextFunction) {
        try {
            const requester = req.user as User;
            const id = idSchema.parse(req.params.id);
            const hardDelete = req.query.hardDelete === 'true' || req.query.hardDelete === '1';

            if (requester.id !== id || requester.role !== 'admin') {
                return next(new CustomError(ErrorCodes.ForbiddenError, ErrorMessages.ForbiddenError));
            }
            const result = await UserService.deleteUser(id, hardDelete);
            res.status(200).json(result);
        } catch (e) {
            next(e);
        }
    }

    async restoreUser(req: Request, res: Response, next: NextFunction) {
        try {
            const requester = req.user as User;
            const id = idSchema.parse(req.params.id);

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
            const id = idSchema.parse(req.params.id);

            const role = await UserService.getUserRole(id);
            res.status(200).json(role);
        } catch (e) {
            next(e);
        }
    }

    async setUserRole(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = idSchema.parse(req.params.id);
            const role = roleSchema.parse(req.body);

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
        } catch (e) {
            next(e);
        }
    }
}

export default new UserController();
