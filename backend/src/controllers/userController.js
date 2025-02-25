import UserService from "../services/userService.js";
import { ValidationError, NotFoundError } from "../utils/errors.js";

class UserController {
    static async createUser(req, res, next) {
        try {
            const { name, email } = req.body; 
            if (!name || !email) {
                throw new ValidationError('Name and email are required');
            }

            const user = await UserService.createUser({ name, email });
            return res.status(201).json(user);
        } catch (e) {
            next(e);
        }
    }

    static async getAllUsers(req, res, next) {
        try {
            const includeDeleted = req.query.includeDeleted === 'true';
            const users = await UserService.getAllUsers(includeDeleted);
            res.status(200).json(users);
        } catch (e) {
            next(e);
        }
    };

    static async deleteUser(req, res, next) {
        try {
            const { id } = req.params;
            const result = await UserService.deleteUser(id); // Валидация на integer "null" и т.д.
            return res.status(200).json(result);
        } catch (e) {
            next(e);
        }
    }

    static async restoreUser(req, res, next) {
        try {
            const { id } = req.params;
            const result = await EventService.restoreUser(id);
            return res.status(200).json(result);
        } catch (e) {
            next(e);
        }
    }
}

export default UserController;