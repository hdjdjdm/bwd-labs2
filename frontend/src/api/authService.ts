import { baseApi } from '@api/axios.ts';
import {
    LoginRequest,
    LoginResponse,
    RegisterRequest,
    RegisterResponse,
} from '@/types';
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
    credentials: RegisterRequest,
): Promise<RegisterResponse> => {
    try {
        const { status, data } = await baseApi.post(
            '/auth/register',
            credentials,
        );

        const message = data.message;

        return { status, message };
    } catch (e: unknown) {
        throw parseError(e);
    }
};
