import styles from './RegisterPage.module.scss';
import Header from '@components/Header/Header.tsx';
import classNames from 'classnames';
import AuthForm from '@components/AuthForm/AuthForm.tsx';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '@api/authService.ts';
import { showCustomToast } from '@utils/customToastUtils.ts';

const RegisterPage: React.FC = () => {
    const navigate = useNavigate();

    const handleRegister = async (
        email: string,
        password: string,
        username: string,
    ) => {
        try {
            const result = await register(email, password, username);

            if (result.status === 201) {
                showCustomToast(
                    result.message,
                    result.status.toString(),
                    'success',
                );
                navigate('/login');
            } else {
                showCustomToast(
                    result.message,
                    result.status.toString(),
                    'warning',
                );
            }
        } catch (e: unknown) {
            let errorMessage = 'Registration failed';
            let errorStatus = '500';
            if (e instanceof Error) {
                const parsedError = JSON.parse(e.message);
                errorMessage = parsedError.errorMessage || errorMessage;
                errorStatus = parsedError.status || errorStatus;
            }
            showCustomToast(errorMessage, errorStatus, 'error');
        }
    };

    return (
        <div className={styles.registerPage}>
            <Header />
            <div
                className={classNames(
                    styles.registerPage__inner,
                    'page__inner',
                )}
            >
                <AuthForm onSubmit={handleRegister} type="register" />
            </div>
        </div>
    );
};

export default RegisterPage;
