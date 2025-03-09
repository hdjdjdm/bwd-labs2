import { NotFoundedError, ServerError } from '../utils/errors.js';
import User from '../models/User.js';
import { Roles } from '../constants/Roles.js';

class UserService {
    async getAllUsers(withDeleted: boolean = false): Promise<User[]> {
        try {
            return await User.findAll({
                paranoid: !withDeleted,
            });
        } catch (e: unknown) {
            if (e instanceof Error) {
                throw new ServerError('Error get users: ' + e.message);
            }
            throw new ServerError('An unknown error occurred while get users.');
        }
    }

    async getUser(id: number): Promise<User> {
        try {
            const user = await User.findByPk(id, { paranoid: false });
            if (!user) {
                throw new NotFoundedError(`User with ID ${id} not found`);
            }

            return user;
        } catch (e: unknown) {
            if (e instanceof Error) {
                throw new ServerError('Error get user: ' + e.message);
            }
            throw new ServerError('An unknown error occurred while get user.');
        }
    }

    async deleteUser(id: number, hardDelete: boolean = false): Promise<{ message: string }> {
        try {
            const user = await User.findByPk(id, {
                paranoid: !hardDelete,
            });
            if (!user) {
                throw new NotFoundedError(`User with id ${id} not found`);
            }

            await user.destroy({
                force: hardDelete,
            });
            return {
                message: `User with id ${id} ${hardDelete ? 'permanently deleted' : 'deleted successfully'}`,
            };
        } catch (e: unknown) {
            if (e instanceof Error) {
                throw new ServerError('Error deleting user: ' + e.message);
            }
            throw new ServerError('An unknown error occurred while deleting user.');
        }
    }

    async restoreUser(id: number): Promise<{ message: string }> {
        try {
            const user = await User.findByPk(id, {
                paranoid: false,
            });
            if (!user) {
                throw new NotFoundedError(`User with id ${id} not found`);
            }

            await user.restore();
            return {
                message: `User with id ${id} restored successfully`,
            };
        } catch (e: unknown) {
            if (e instanceof Error) {
                throw new ServerError('Error restoring user: ' + e.message);
            }
            throw new ServerError('An unknown error occurred while restoring user.');
        }
    }

    async getUserRole(id: number): Promise<{ role: string }> {
        try {
            const user = await User.findByPk(id, { paranoid: false });
            if (!user) {
                throw new NotFoundedError(`User with id ${id} not found`);
            }

            return { role: user.role };
        } catch (e: unknown) {
            if (e instanceof Error) {
                throw new ServerError('Error get user role: ' + e.message);
            }
            throw new ServerError('An unknown error occurred while get user role.');
        }
    }

    async setUserRole(id: number, newRole: Roles): Promise<{ message: string }> {
        try {
            const user = await User.findByPk(id, { paranoid: false });
            if (!user) {
                throw new NotFoundedError(`User with id ${id} not found`);
            }

            user.role = newRole;
            await user.save();

            return {
                message: `User with id ${id} role updated to ${newRole} successfully`,
            };
        } catch (e: unknown) {
            if (e instanceof Error) {
                throw new ServerError('Error updating user role: ' + e.message);
            }
            throw new ServerError('An unknown error occurred while updating user role.');
        }
    }
}

export default new UserService();
