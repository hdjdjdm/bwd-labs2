import styles from './LoginPage.module.scss';
import Header from '@components/Header/Header.tsx';
import classNames from 'classnames';
import React from 'react';
import AuthForm from '@components/AuthForm/AuthForm.tsx';

const LoginPage: React.FC = () => {
    const handleLogin = (email: string, password: string) => {
        console.log('Логин ', email, password);
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
