import User from '../models/User.js';
import { Roles } from '../constants/Roles.js';
import { ErrorCodes } from '@constants/Errors.js';
import CustomError from '@utils/CustomError.js';

class UserService {
    async getAllUsers(withDeleted: boolean = false): Promise<User[]> {
        return await User.findAll({
            paranoid: !withDeleted,
        });
    }

    async getUser(id: number): Promise<User> {
        const user = await User.findByPk(id, { paranoid: false });
        if (!user) {
            throw new CustomError(ErrorCodes.NotFoundedError, `User with ID ${id} not found`);
        }
        return user;
    }

    async deleteUser(id: number, hardDelete: boolean = false): Promise<{ message: string }> {
        const user = await User.findByPk(id, {
            paranoid: !hardDelete,
        });
        if (!user) {
            throw new CustomError(ErrorCodes.NotFoundedError, `User with id ${id} not found`);
        }

        await user.destroy({
            force: hardDelete,
        });
        return {
            message: `User with id ${id} ${hardDelete ? 'permanently deleted' : 'deleted successfully'}`,
        };
    }

    async restoreUser(id: number): Promise<{ message: string }> {
        const user = await User.findByPk(id, {
            paranoid: false,
        });
        if (!user) {
            throw new CustomError(ErrorCodes.NotFoundedError, `User with id ${id} not found`);
        }

        await user.restore();
        return {
            message: `User with id ${id} restored successfully`,
        };
    }

    async getUserRole(id: number): Promise<{ role: string }> {
        const user = await User.findByPk(id, { paranoid: false });
        if (!user) {
            throw new CustomError(ErrorCodes.NotFoundedError, `User with id ${id} not found`);
        }

        return { role: user.role };
    }

    async setUserRole(id: number, newRole: Roles): Promise<{ message: string }> {
        const user = await User.findByPk(id, { paranoid: false });
        if (!user) {
            throw new CustomError(ErrorCodes.NotFoundedError, `User with id ${id} not found`);
        }

        user.role = newRole;
        await user.save();

        return {
            message: `User with id ${id} role updated to ${newRole} successfully`,
        };
    }
}

export default new UserService();
