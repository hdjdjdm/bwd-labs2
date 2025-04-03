import { NextFunction, Request, Response } from 'express';
import UserService from '@services/UserService.js';
import { Roles } from '@constants/Roles.js';
import CustomError from '@utils/CustomError.js';
import { ErrorCodes } from '@constants/Errors.js';
import { ChangeUserRoleDto } from '@dto/UserDto.js';
import UserMapper from '@mappers/UserMapper.js';

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
            const id = Number(req.params.id);

            UserController.validateUserId(id);

            const user = await UserService.getUser(id);
            res.status(200).json(UserMapper.toResponseDto(user));
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
}

export default new UserController();
