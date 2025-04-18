import styles from './LoginPage.module.scss';
import Header from '@components/Header/Header.tsx';
import classNames from 'classnames';
import React, { useEffect } from 'react';
import AuthForm from '@components/AuthForm/AuthForm.tsx';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/app/hooks.ts';
import { login } from '@/app/slices/authSlice.ts';

const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const user = useAppSelector((state) => state.auth.user);

    useEffect(() => {
        if (user) {
            navigate('/events');
        }
    }, [navigate, user]);

    const handleLogin = async (email: string, password: string) => {
        dispatch(login({ email, password }))
            .unwrap()
            .then(() => navigate('/events'));
    };

    return (
        <div className={styles.loginPage}>
            <Header />
            <div className={classNames(styles.loginPage__inner, 'page__inner')}>
                <AuthForm onSubmit={handleLogin} type="login" />
            </div>
        </div>
    );
};
export default LoginPage;
