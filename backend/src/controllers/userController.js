const { error } = require("console");
const UserService = require("../services/userService");

class UserController {
    static async createUser(req, res) {
        try {
            const { name, email } = req.body;
            if (!name || !email) {
                return res.status(400).json({ message: 'Name and email required!' })
            }

            const user = await UserService.createUser({ name, email });
            return res.status(201).json(user);
        } catch (e) {
            return res.status(500).json({ message: e.message });
        }
    }
    
    static async getAllUsers(req, res) {
        try {
            const users = await UserService.getAllUsers();
            res.status(200).json(users);
        } catch (e) {
            res.status(500).json({ message: e.message });
        }
    };
}

module.exports = UserController;