import styles from './LoginPage.module.scss';
import Header from '@components/Header/Header.tsx';
import classNames from 'classnames';
import React, { useContext, useEffect } from 'react';
import AuthForm from '@components/AuthForm/AuthForm.tsx';
import { useNavigate } from 'react-router-dom';
import { login as apiLogin } from '@api/authService.ts';
import { AuthContext } from '@contexts/AuthContext.tsx';
import { showCustomToast } from '@utils/customToastUtils.ts';
import { parseError } from '@utils/errorUtils.ts';

const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const { user, login } = useContext(AuthContext)!;

    useEffect(() => {
        if (user) {
            navigate('/events');
        }
    }, [user]);

    const handleLogin = async (email: string, password: string) => {
        try {
            const { token, username, message } = await apiLogin(
                email,
                password,
            );
            login(username, token);
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
