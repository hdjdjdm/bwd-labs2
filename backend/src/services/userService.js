const { User } = require('../models');

class UserService {
    static async createUser(data) {
        try {
            const user = await User.create(data);
            return user;
        } catch (e) {
            throw new Error('Error creating user: ' + e.message);
        }
    }
    
    static async getAllUsers() {
        try {
            const users = await User.findAll();
            return users;
        } catch (e) {
            throw new Error('Error get users: ' + e.message);
        }
    }
}

module.exports = UserService;