import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { jwtDecode } from 'jwt-decode';
import {
    getFromLocalStorage,
    removeFromLocalStorage,
    saveToLocalStorage,
} from '@utils/localStorageUtils';
import { showCustomToast } from '@utils/customToastUtils';
import UserDto from '@dtos/UserDto';
import { parseError } from '@utils/errorUtils.ts';
import { login as apiLogin } from '@api/authService.ts';

interface AuthState {
    user: UserDto | null;
    loading: boolean;
    error: string | null;
}

interface LoginPayload {
    email: string;
    password: string;
}

const initialState: AuthState = {
    user: null,
    loading: false,
    error: null,
};

export const login = createAsyncThunk(
    'auth/login',
    async ({ email, password }: LoginPayload, { rejectWithValue }) => {
        try {
            const { token, user, message } = await apiLogin({
                email,
                password,
            });

            saveToLocalStorage('token', token);
            saveToLocalStorage('user', JSON.stringify(user));
            showCustomToast(message, 'success', '200');

            return { user, token };
        } catch (e: unknown) {
            const { status, errorMessage } = parseError(e);
            showCustomToast(errorMessage, 'error', status.toString());
            return rejectWithValue(errorMessage);
        }
    },
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout(state) {
            removeFromLocalStorage('token');
            removeFromLocalStorage('user');
            state.user = null;
            state.error = null;
        },
        checkTokenValidity(state) {
            const token = getFromLocalStorage('token');
            const userDataStr = getFromLocalStorage('user');

            if (token && userDataStr) {
                try {
                    const decoded: { exp: number } = jwtDecode(token);
                    const currentTime = Math.floor(Date.now() / 1000);

                    if (decoded.exp > currentTime) {
                        state.user = JSON.parse(userDataStr);
                    } else {
                        showCustomToast(
                            'Время сеанса истекло! Необходима повторная авторизация',
                            'warning',
                        );
                        authSlice.caseReducers.logout(state);
                    }
                } catch (error) {
                    console.error('Неверный токен:', error);
                    showCustomToast('Неверный токен', 'error');
                    authSlice.caseReducers.logout(state);
                }
            } else {
                authSlice.caseReducers.logout(state);
            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.error = null;
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { logout, checkTokenValidity } = authSlice.actions;
export default authSlice.reducer;
