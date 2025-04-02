import React, { createContext, useState, useEffect, ReactNode } from 'react';
import {
    getFromLocalStorage,
    removeFromLocalStorage,
    saveToLocalStorage,
} from '@utils/localStorageUtils.ts';
import { jwtDecode } from 'jwt-decode';
import { showCustomToast } from '@utils/customToastUtils.ts';
import UserDto from '@dtos/UserDto.ts';

interface AuthContextType {
    user: UserDto | null;
    login: (userData: UserDto, token: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<UserDto | null>(null);

    useEffect(() => {
        checkTokenValidity();
        const interval = setInterval(checkTokenValidity, 60 * 1000);
        return () => clearInterval(interval);
    }, []);

    const login = (userData: UserDto, token: string) => {
        saveToLocalStorage('token', token);
        saveToLocalStorage('user', JSON.stringify(userData));
        setUser(userData);
    };

    const logout = () => {
        removeFromLocalStorage('token');
        removeFromLocalStorage('user');
        setUser(null);
    };

    const checkTokenValidity = () => {
        const token = getFromLocalStorage('token');
        const userDataStr = getFromLocalStorage('user');

        if (token && userDataStr) {
            try {
                const decoded: { exp: number } = jwtDecode(token);
                const currentTime = Math.floor(Date.now() / 1000);

                if (decoded.exp > currentTime) {
                    const userData: UserDto = JSON.parse(userDataStr);
                    setUser(userData);
                } else {
                    showCustomToast(
                        'Время сеанса истекло! Необходима повторная авторизация',
                        'warning',
                    );
                    logout();
                }
            } catch (error) {
                showCustomToast('Неверный токен', 'error');
                console.error('Неверный токен:', error);
                logout();
            }
        } else {
            logout();
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
