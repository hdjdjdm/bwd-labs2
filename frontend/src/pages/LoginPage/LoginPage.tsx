import styles from './LoginPage.module.scss';
import Header from '@components/Header/Header.tsx';
import classNames from 'classnames';
import React, { useEffect } from 'react';
import AuthForm from '@components/AuthForm/AuthForm.tsx';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '@/app/hooks.ts';

const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const user = useAppSelector((state) => state.auth.user);

    useEffect(() => {
        if (user) {
            navigate('/events');
        }
    }, [navigate, user]);

    return (
        <div className={styles.loginPage}>
            <Header />
            <div className={classNames(styles.loginPage__inner, 'page__inner')}>
                <AuthForm type="login" />
            </div>
        </div>
    );
};
export default LoginPage;
