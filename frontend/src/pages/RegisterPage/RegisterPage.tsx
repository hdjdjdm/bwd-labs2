import styles from './RegisterPage.module.scss';
import Header from '@components/Header/Header.tsx';
import classNames from 'classnames';
import AuthForm from '@components/AuthForm/AuthForm.tsx';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const RegisterPage: React.FC = () => {
    const navigate = useNavigate();

    const handleRegister = (
        email: string,
        password: string,
        username?: string,
    ) => {
        console.log('Регистрация ', email, password, username);
        navigate('/events');
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
