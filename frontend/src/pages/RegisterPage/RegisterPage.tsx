import styles from './RegisterPage.module.scss';
import Header from '@components/Header/Header.tsx';
import classNames from 'classnames';
import AuthForm from '@components/AuthForm/AuthForm.tsx';
import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '@api/authService.ts';
import { showCustomToast } from '@utils/customToastUtils.ts';
import { AuthContext } from '@contexts/AuthContext.tsx';
import { parseError } from '@utils/errorUtils.ts';

const RegisterPage: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext)!;

    useEffect(() => {
        if (user) {
            navigate('/events');
        }
    }, [navigate, user]);

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
                    'success',
                    result.status.toString(),
                );
                navigate('/login');
            } else {
                showCustomToast(
                    result.message,
                    'warning',
                    result.status.toString(),
                );
            }
        } catch (e: unknown) {
            const { status, errorMessage } = parseError(e);
            showCustomToast(errorMessage, 'error', status.toString());
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
