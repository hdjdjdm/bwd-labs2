import { Sequelize } from 'sequelize';
import models from '../models/index.js';
import { NotFoundedError, ServerError, ValidError } from '../utils/errors.js';
const { User } = models;

class UserService {
    static async createUser(data) {
        try {
            const user = await User.create(data);
            return user;
        } catch (e) {
            if (e instanceof Sequelize.UniqueConstraintError) {
                throw new ValidError('Email already exists. Please use a different email.')
            }
            throw new ServerError('Error creating user: ' + e.message);
        }
    }
    
    static async getAllUsers(withDeleted = false) {
        try {
            const users = await User.findAll({
                paranoid: !withDeleted
            });

            return users;
        } catch (e) {
            throw new ServerError('Error get users: ' + e.message);
        }
    }

    static async getUser(id) {
        try {
            const user = await User.findByPk(id);
            if (!user) {
                throw new NotFoundedError(`User with ID ${id} not found`);
            }
            
            return user;
        } catch (e) {
            throw new ServerError('Error get user: ' + e.message);
        }
    }

    static async deleteUser(id, hardDelete = false) {
        try {
            const user = await User.findByPk(id, { paranoid: !hardDelete });
            if (!user) {
                throw new NotFoundedError(`User with id ${id} not found`);
            }

            await user.destroy({ force: hardDelete });
            return { message: `User with id ${id} ${hardDelete ? 'permanently deleted' : 'deleted successfully'}` };
        } catch (e) {
            throw new ServerError('Error deleting user: ' + e.message);
        }
    }

    static async restoreUser(id) {
        try {
            const user = await User.findByPk(id, { paranoid: false });
            if (!user) {
                throw new NotFoundedError(`User with id ${id} not found`);
            }

            await user.restore();
            return { message: `User with id ${id} restored successfully` };
        } catch (e) {
            throw new ServerError(`Failed to restore user: ${e.message}`);
        }
    }

    static async getUserRole(id) {
        try {
            const user = await User.findByPk(id);
            if (!user) {
                throw new NotFoundedError(`User with id ${id} not found`);
            }
            
            return { role: user.role };
        } catch (e) {
            throw new ServerError('Error get user role: ' + e.message);
        }
    }

    static async setUserRole(id, newRole) {
        try {
            const user = await User.findByPk(id);
            if (!user) {
                throw new NotFoundedError(`User with id ${id} not found`);
            }

            user.role = newRole;
            await user.save();
            
            return { message: `User with id ${id} role updated to ${newRole} successfully` };
        } catch (e) {
            throw new ServerError('Error updating user user: ' + e.message);
        }
    }
}

export default UserService;