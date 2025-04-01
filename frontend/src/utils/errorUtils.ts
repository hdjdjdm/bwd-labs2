import { AxiosError } from 'axios';

export interface ErrorResponse {
    status: number;
    errorMessage: string;
}

export const parseError = (e: unknown): ErrorResponse => {
    if (e instanceof AxiosError) {
        return {
            status: e.response?.status || 500,
            errorMessage: e.response?.data?.error || 'Request error',
        };
    }

    if (typeof e === 'object' && e !== null && 'errorMessage' in e) {
        const err = e as ErrorResponse;
        return {
            status: err.status || 500,
            errorMessage: err.errorMessage || 'Unknown error',
        };
    }

    return { status: 500, errorMessage: 'Unknown error' };
};
