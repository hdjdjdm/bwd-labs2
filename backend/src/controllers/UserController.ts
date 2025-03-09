import { Request, Response, NextFunction } from 'express';
import UserService from '@services/UserService.js';
import { ValidError } from '@utils/errors.js';
import { Roles } from '@constants/Roles.js';
import UserDTO from '@dto/UserDTO.js';

class UserController {
    async getAllUsers(req: Request, res: Response, next: NextFunction) {
        try {
            const withDeleted = req.query.withDeleted === 'true' || req.query.withDeleted === '1';
            const users = await UserService.getAllUsers(withDeleted);
            res.status(200).json(users);
        } catch (e) {
            next(e);
        }
    }

    async deleteUser(req: Request, res: Response, next: NextFunction) {
        try {
            const id = Number(req.params.id);
            const hardDelete = req.query.hardDelete === 'true' || req.query.hardDelete === '1';

            UserController.validateUserId(id);

            const result = await UserService.deleteUser(id, hardDelete);
            res.status(200).json(result);
        } catch (e) {
            next(e);
        }
    }

    async restoreUser(req: Request, res: Response, next: NextFunction) {
        try {
            const id = Number(req.params.id);

            UserController.validateUserId(id);

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

            const users = await UserService.getUserRole(id);
            res.status(200).json(users);
        } catch (e) {
            next(e);
        }
    }

    async setUserRole(req: Request, res: Response) {
        const id = Number(req.params.id);
        const { role } = req.body;

        UserController.validateUserId(id);

        if (!Object.values(Roles).includes(role)) {
            throw new ValidError(`Invalid role. Allowed roles are: ${Object.values(Roles).join(', ')}`);
        }

        const users = await UserService.setUserRole(id, role);
        res.status(200).json(users);
    }

    private static validateUserId(id: number): void {
        if (!Number.isInteger(id) || id <= 0) {
            throw new ValidError('Invalid user ID. It must be a positive integer.');
        }
    }

    private static validateUserData(data: Partial<UserDTO>): void {
        if (data.name) {
            if (data.name.trim() === '') {
                throw new ValidError('Title must be a non-empty string.');
            }
            data.name = data.name.trim();
        }

        if (data.email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(data.email)) {
                throw new ValidError('Invalid email format.');
            }
            data.email = data.email.trim();
        }

        if (data.password) {
            if (data.password.trim() === '') {
                throw new ValidError('Title must be a non-empty string.');
            }
            data.password = data.password.trim();
        }
    }
}

export default new UserController();
