import { AxiosError } from 'axios';
import { baseApi } from '@api/axios.ts';
import { LoginResponse, RegisterResponse } from '@/types';

export const login = async (
    email: string,
    password: string,
): Promise<LoginResponse> => {
    try {
        const { data } = await baseApi.post('/auth/login', {
            email,
            password,
        });

        return data;
    } catch (error: unknown) {
        if (error instanceof AxiosError) {
            const errorMessage = error.response?.data?.error || 'Auth error';
            const status = error.response?.status;
            throw new Error(JSON.stringify({ status, errorMessage }));
        }
        throw new Error(
            JSON.stringify({ status: 500, errorMessage: 'Unknown error' }),
        );
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
    } catch (error: unknown) {
        if (error instanceof AxiosError) {
            //todo error util
            const errorMessage =
                error.response?.data?.error || 'Register error';
            const status = error.response?.status;
            throw new Error(JSON.stringify({ status, errorMessage }));
        }
        throw new Error(
            JSON.stringify({ status: 500, errorMessage: 'Unknown error' }),
        );
    }
};
