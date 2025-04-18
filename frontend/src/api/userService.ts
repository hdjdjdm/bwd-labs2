import { baseApi } from '@api/axios.ts';
import { parseError } from '@utils/errorUtils.ts';
import UserDto from '@dtos/UserDto.ts';

export const getUser = async (id: number): Promise<UserDto> => {
    try {
        const { data } = await baseApi.get(`/users/${id}`);
        return data;
    } catch (e: unknown) {
        throw parseError(e);
    }
};

export const updateUser = async (
    userId: number,
    updatedFields: Partial<UserDto>,
): Promise<UserDto> => {
    try {
        const { data } = await baseApi.put(`/events/${userId}`, updatedFields);
        return data;
    } catch (e: unknown) {
        throw parseError(e);
    }
};
