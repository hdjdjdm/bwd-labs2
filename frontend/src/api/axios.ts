import axios from 'axios';
import { getFromLocalStorage } from '@utils/localStorageUtils.ts';

export const baseApi = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

baseApi.interceptors.request.use(
    (config) => {
        const token = getFromLocalStorage('token');

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    },
);
