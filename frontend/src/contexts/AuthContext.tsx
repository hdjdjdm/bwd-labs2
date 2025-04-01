import React, { createContext, useState, useEffect, ReactNode } from 'react';
import {
    getFromLocalStorage,
    removeFromLocalStorage,
    saveToLocalStorage,
} from '@utils/localStorageUtils.ts';

interface User {
    username: string;
}

interface AuthContextType {
    user: User | null;
    login: (username: string, token: string) => void;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
    undefined,
);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const token = getFromLocalStorage('token');
        const username = getFromLocalStorage('username');
        if (token && username) {
            setUser({ username });
        }
    }, []);

    const login = (username: string, token: string) => {
        saveToLocalStorage('token', token);
        saveToLocalStorage('username', username);
        setUser({ username });
    };

    const logout = () => {
        removeFromLocalStorage('token');
        removeFromLocalStorage('username');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
