import { baseApi } from '@api/axios.ts';
import { LoginRequest, LoginResponse, RegisterResponse } from '@/types';
import { parseError } from '@utils/errorUtils.ts';

export const login = async (
    credentials: LoginRequest,
): Promise<LoginResponse> => {
    try {
        const { data } = await baseApi.post('/auth/login', {
            email: credentials.email,
            password: credentials.password,
        });

        return data;
    } catch (e: unknown) {
        throw parseError(e);
    }
};

export const register = async (
    email: string,
    password: string,
    username: string,
): Promise<RegisterResponse> => {
    try {
        const { status, data } = await baseApi.post('/auth/register', {
            email,
            password,
            name: username,
        });

        const message = data.message;

        return { status, message };
    } catch (e: unknown) {
        throw parseError(e);
    }
};
