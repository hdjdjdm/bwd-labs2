import styles from './RegisterPage.module.scss';
import Header from '@components/Header/Header.tsx';
import classNames from 'classnames';
import AuthForm from '@components/AuthForm/AuthForm.tsx';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '@/app/hooks.ts';

const RegisterPage: React.FC = () => {
    const navigate = useNavigate();
    const user = useAppSelector((state) => state.auth.user);

    useEffect(() => {
        if (user) {
            navigate('/events');
        }
    }, [navigate, user]);

    return (
        <div className={styles.registerPage}>
            <Header />
            <div
                className={classNames(
                    styles.registerPage__inner,
                    'page__inner',
                )}
            >
                <AuthForm type="register" />
            </div>
        </div>
    );
};

export default RegisterPage;
