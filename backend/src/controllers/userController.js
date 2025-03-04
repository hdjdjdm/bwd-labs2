import ROLES from '../constants/roles.js';
import UserService from '../services/userService.js';
import { ValidError } from '../utils/errors.js';

class UserController {
    static async createUser(req, res, next) {
        try {
            let { name, email } = req.body;

            if (!name || !email) {
                throw new ValidError('Name and email cannot be empty.');
            }

            if (typeof name !== 'string' || name.trim() === '') {
                throw new ValidError('Name must be a non-empty string');
            }
            name = name.trim();

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                throw new ValidError('Invalid email format.');
            }
            email = email.trim();

            const user = await UserService.createUser({
                name,
                email,
            });
            return res.status(201).json(user);
        } catch (e) {
            next(e);
        }
    }

    static async getAllUsers(req, res, next) {
        try {
            const withDeleted =
                req.query.withDeleted === 'true' ||
                req.query.withDeleted === '1';
            const users = await UserService.getAllUsers(withDeleted);
            res.status(200).json(users);
        } catch (e) {
            next(e);
        }
    }

    static async deleteUser(req, res, next) {
        try {
            const id = Number(req.params.id);
            const hardDelete =
                req.query.hardDelete === 'true' || req.query.hardDelete === '1';

            if (!Number.isInteger(id) || id <= 0) {
                throw new ValidError(
                    'Invalid user ID. It must be a positive integer.',
                );
            }

            const result = await UserService.deleteUser(id, hardDelete);
            return res.status(200).json(result);
        } catch (e) {
            next(e);
        }
    }

    static async restoreUser(req, res, next) {
        try {
            const id = Number(req.params.id);

            if (!Number.isInteger(id) || id <= 0) {
                throw new ValidError(
                    'Invalid user ID. It must be a positive integer.',
                );
            }

            const result = await UserService.restoreUser(id);
            return res.status(200).json(result);
        } catch (e) {
            next(e);
        }
    }

    static async getUserRole(req, res, next) {
        try {
            const id = Number(req.params.id);

            if (!Number.isInteger(id) || id <= 0) {
                throw new ValidError(
                    'Invalid user ID. It must be a positive integer.',
                );
            }

            const users = await UserService.getUserRole(id);
            res.status(200).json(users);
        } catch (e) {
            next(e);
        }
    }

    static async setUserRole(req, res, next) {
        try {
            const id = Number(req.params.id);
            const { role } = req.body;

            if (!Number.isInteger(id) || id <= 0) {
                throw new ValidError(
                    'Invalid user ID. It must be a positive integer.',
                );
            }

            if (!Object.values(ROLES).includes(role)) {
                throw new ValidError(
                    `Invalid role. Allowed roles are: ${Object.values(ROLES).join(', ')}`,
                );
            }

            const users = await UserService.setUserRole(id, role);
            res.status(200).json(users);
        } catch (e) {
            next(e);
        }
    }
}

export default UserController;
