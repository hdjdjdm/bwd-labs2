import User from '../models/User.js';
import { Roles } from '../constants/Roles.js';
import { ErrorCodes } from '@constants/Errors.js';
import CustomError from '@utils/CustomError.js';
import { UserDto } from '@dto/UserDto.js';

class UserService {
    async getAllUsers(withDeleted: boolean = false): Promise<User[]> {
        return await User.findAll({
            paranoid: !withDeleted,
        });
    }

    async getUser(id: number): Promise<User> {
        return await User.findByPk(id, {
            paranoid: false,
            rejectOnEmpty: new CustomError(ErrorCodes.NotFoundedError, `User with ID ${id} not found`),
        });
    }

    async updateUser(id: number, updateData: Partial<UserDto>): Promise<User> {
        const user = await this.getUser(id);

        await user.update(updateData);
        return this.getUser(user.id);
    }

    async deleteUser(id: number, hardDelete: boolean = false): Promise<{ message: string }> {
        const user = await User.findByPk(id, {
            paranoid: !hardDelete,
            rejectOnEmpty: new CustomError(ErrorCodes.NotFoundedError, `User with id ${id} not found`),
        });

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
            rejectOnEmpty: new CustomError(ErrorCodes.NotFoundedError, `User with id ${id} not found`),
        });

        await user.restore();
        return {
            message: `User with id ${id} restored successfully`,
        };
    }

    async getUserRole(id: number): Promise<{ role: string }> {
        const user = await this.getUser(id);

        return { role: user.role };
    }

    async setUserRole(id: number, newRole: Roles): Promise<{ message: string }> {
        const user = await this.getUser(id);

        user.role = newRole;
        await user.save();

        return {
            message: `User with id ${id} role updated to ${newRole} successfully`,
        };
    }
}

export default new UserService();
