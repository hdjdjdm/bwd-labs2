const UserService = require("../services/userService");
const { ValidationError, NotFoundError } = require("../utils/errors");

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
            const users = await UserService.getAllUsers();
            res.status(200).json(users);
        } catch (e) {
            next(e);
        }
    };
}

module.exports = UserController;