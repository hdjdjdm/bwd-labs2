import User from '../models/index.js';

class UserService {
    static async createUser(data) {
        try {
            const user = await User.create(data);
            return user;
        } catch (e) {
            console.log(e); //todo Проверка на валидацию
            throw new Error('Error creating user: ' + e.message);
        }
    }
    
    static async getAllEvents(includeDeleted) {
        try {
            const users = await User.findAll({
                paranoid: !includeDeleted
            });

            return users;
        } catch (e) {
            throw new Error('Error get users: ' + e.message);
        }
    }

    static async deleteUser(id) {
        try {
            const user = await User.findByPk(id);
            if (!user) {
                throw new Error(`User with id ${id} not found`);
            }
    
            await User.destroy();
            return { message: `User with id ${id} deleted successfully` };
        } catch (e) {
            throw new Error('Error deleting user: ' + e.message);
        }
    }

    static async restoreUser(id) {
        try {
            const user = await User.findByPk(id, { paranoid: false });
            if (!user) {
                throw new Error(`User with id ${id} not found`);
            }
    
            await user.restore();
            return { message: `User with id ${id} restore successfully` };
        } catch (e) {
            throw new Error('User restoring event: ' + e.message);
        }
    }
}

export default UserService;