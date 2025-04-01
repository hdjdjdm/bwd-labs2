import styles from './LoginPage.module.scss';
import Header from '@components/Header/Header.tsx';
import classNames from 'classnames';
import React, { useContext } from 'react';
import AuthForm from '@components/AuthForm/AuthForm.tsx';
import { useNavigate } from 'react-router-dom';
import { login as apiLogin } from '@api/authService.ts';
import { AuthContext } from '@contexts/AuthContext.tsx';
import { showCustomToast } from '@utils/customToastUtils.ts';

const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const { login } = useContext(AuthContext)!;

    const handleLogin = async (email: string, password: string) => {
        try {
            const { token, username, message } = await apiLogin(
                email,
                password,
            );
            login(username, token);
            showCustomToast(message, '200', 'success');

            navigate('/events');
        } catch (e: unknown) {
            let errorMessage = 'Login failed';
            let errorStatus = '500';
            if (e instanceof Error) {
                const parsedError = JSON.parse(e.message);
                errorMessage = parsedError.errorMessage || errorMessage;
                errorStatus = parsedError.status || errorStatus;
            }
            showCustomToast(errorMessage, errorStatus, 'error'); //todo сделать красоту
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
