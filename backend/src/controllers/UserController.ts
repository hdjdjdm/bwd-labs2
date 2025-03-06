import { Request, Response, NextFunction } from 'express';
import UserService from '@services/UserService';
import { ValidError } from '@utils/errors';
import { Roles } from '@constants/Roles';

interface ICreateUserBody {
    name: string;
    email: string;
}

interface UserData {
    name?: string;
    email?: string;
}

class UserController {
    static async createUser(req: Request, res: Response, next: NextFunction) {
        try {
            const { name, email }: ICreateUserBody = req.body;

            if (!name || !email) {
                throw new ValidError('Name and email are required.');
            }

            UserController.validateUserData({ name, email });

            const user = await UserService.createUser({
                name,
                email,
            });
            res.status(201).json(user);
        } catch (e) {
            next(e);
        }
    }

    static async getAllUsers(req: Request, res: Response, next: NextFunction) {
        try {
            const withDeleted = req.query.withDeleted === 'true' || req.query.withDeleted === '1';
            const users = await UserService.getAllUsers(withDeleted);
            res.status(200).json(users);
        } catch (e) {
            next(e);
        }
    }

    static async deleteUser(req: Request, res: Response, next: NextFunction) {
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

    static async restoreUser(req: Request, res: Response, next: NextFunction) {
        try {
            const id = Number(req.params.id);

            UserController.validateUserId(id);

            const result = await UserService.restoreUser(id);
            res.status(200).json(result);
        } catch (e) {
            next(e);
        }
    }

    static async getUserRole(req: Request, res: Response, next: NextFunction) {
        try {
            const id = Number(req.params.id);

            UserController.validateUserId(id);

            const users = await UserService.getUserRole(id);
            res.status(200).json(users);
        } catch (e) {
            next(e);
        }
    }

    static async setUserRole(req: Request, res: Response, next: NextFunction) {
        try {
            const id = Number(req.params.id);
            const { role } = req.body;

            UserController.validateUserId(id);

            if (!Object.values(Roles).includes(role)) {
                throw new ValidError(`Invalid role. Allowed roles are: ${Object.values(Roles).join(', ')}`);
            }

            const users = await UserService.setUserRole(id, role);
            res.status(200).json(users);
        } catch (e) {
            next(e);
        }
    }

    static validateUserId(id: number): void {
        if (!Number.isInteger(id) || id <= 0) {
            throw new ValidError('Invalid user ID. It must be a positive integer.');
        }
    }

    static validateUserData(data: UserData): void {
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
    }
}

export default UserController;
