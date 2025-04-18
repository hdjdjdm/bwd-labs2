import styles from './LoginPage.module.scss';
import Header from '@components/Header/Header.tsx';
import classNames from 'classnames';
import React, { useEffect } from 'react';
import AuthForm from '@components/AuthForm/AuthForm.tsx';
import { useNavigate } from 'react-router-dom';
import { login as apiLogin } from '@api/authService.ts';
import { showCustomToast } from '@utils/customToastUtils.ts';
import { parseError } from '@utils/errorUtils.ts';
import { useAppDispatch, useAppSelector } from '@/app/hooks.ts';
import { login } from '@/app/slices/authSlice.ts';

const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const user = useAppSelector((state) => state.auth.user);
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (user) {
            navigate('/events');
        }
    }, [user]);

    const handleLogin = async (email: string, password: string) => {
        try {
            const { token, user, message } = await apiLogin({
                email,
                password,
            });

            dispatch(login({ user, token }));

            showCustomToast(message, 'success', '200');
            navigate('/events');
        } catch (e: unknown) {
            const { status, errorMessage } = parseError(e);
            showCustomToast(errorMessage, 'error', status.toString());
        }
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
