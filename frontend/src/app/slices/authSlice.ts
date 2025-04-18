import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { jwtDecode } from 'jwt-decode';
import {
    getFromLocalStorage,
    saveToLocalStorage,
    removeFromLocalStorage,
} from '@utils/localStorageUtils';
import { showCustomToast } from '@utils/customToastUtils';
import UserDto from '@dtos/UserDto';

interface AuthState {
    user: UserDto | null;
}

const initialState: AuthState = {
    user: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUser(state, action: PayloadAction<UserDto>) {
            state.user = action.payload;
        },
        clearUser(state) {
            state.user = null;
        },
        login(state, action: PayloadAction<{ user: UserDto; token: string }>) {
            const { user, token } = action.payload;
            saveToLocalStorage('token', token);
            saveToLocalStorage('user', JSON.stringify(user));
            state.user = user;
        },
        logout(state) {
            removeFromLocalStorage('token');
            removeFromLocalStorage('user');
            state.user = null;
        },
        checkTokenValidity(state) {
            const token = getFromLocalStorage('token');
            const userDataStr = getFromLocalStorage('user');

            if (token && userDataStr) {
                try {
                    const decoded: { exp: number } = jwtDecode(token);
                    const currentTime = Math.floor(Date.now() / 1000);

                    if (decoded.exp > currentTime) {
                        const user: UserDto = JSON.parse(userDataStr);
                        state.user = user;
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
});

export const { login, logout, setUser, clearUser } = authSlice.actions;
export default authSlice.reducer;
