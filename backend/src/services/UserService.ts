import User from '../models/User.js';
import { Roles } from '../constants/Roles.js';
import { ErrorCodes } from '@constants/Errors.js';
import CustomError from '@utils/CustomError.js';
import Event from '@models/Event.js';
import { UpdateUserInput } from '@validation/user.js';

class UserService {
    async getAllUsers(withDeleted: boolean = false): Promise<User[]> {
        return await User.findAll({
            paranoid: !withDeleted,
        });
    }

    async getUser(id: number, sendDeletedEvents: boolean = false): Promise<User> {
        return await User.findByPk(id, {
            paranoid: false,
            rejectOnEmpty: new CustomError(ErrorCodes.NotFoundedError, `Пользователь с id "${id}" не найден`),
            include: [
                {
                    model: Event,
                    as: 'events',
                    paranoid: !sendDeletedEvents,
                    include: [
                        {
                            model: User,
                            as: 'creator',
                            paranoid: false,
                        },
                    ],
                },
            ],
        });
    }

    async updateUser(id: number, updateData: UpdateUserInput): Promise<User> {
        const user = await this.getUser(id);

        await user.update(updateData);
        return this.getUser(user.id);
    }

    async deleteUser(id: number, hardDelete: boolean = false): Promise<{ message: string }> {
        const user = await User.findByPk(id, {
            paranoid: !hardDelete,
            rejectOnEmpty: new CustomError(ErrorCodes.NotFoundedError, `Пользователь с id "${id}" не найден`),
        });

        await user.destroy({
            force: hardDelete,
        });
        return {
            message: `Пользователь с id "${id}" ${hardDelete ? 'удален' : 'перемещен в удаленные'}`,
        };
    }

    async restoreUser(id: number): Promise<{ message: string }> {
        const user = await User.findByPk(id, {
            paranoid: false,
            rejectOnEmpty: new CustomError(ErrorCodes.NotFoundedError, `Пользователь с id "${id}" не найден`),
        });

        await user.restore();
        return {
            message: `Пользователь с id "${id}" восстановлен`,
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
            message: `Роль пользователя с id "${id}" обновлена до "${newRole}"`,
        };
    }
}

export default new UserService();
