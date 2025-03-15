import styles from './AuthForm.module.scss';
import classNames from 'classnames';
import { useState } from 'react';
import React from 'react';
import {
    AccountIcon,
    AtIcon,
    EyeOffOutlineIcon,
    EyeOutlineIcon,
} from '@assets/icons/icons.ts';

interface AuthFormProps {
    type: 'login' | 'register';
    onSubmit: (email: string, password: string, username?: string) => void;
}

const AuthForm: React.FC<AuthFormProps> = ({ type, onSubmit }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [isPasswordShow, setIsPasswordShow] = useState(false);

    const toggleIsPasswordShow = () => {
        setIsPasswordShow((prev) => !prev);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (type === 'register') {
            onSubmit(email, password, username);
        } else {
            onSubmit(email, password);
        }
    };

    return (
        <form
            className={classNames(styles.authForm, 'block')}
            onSubmit={handleSubmit}
        >
            <h2 className={styles.authForm__title}>
                {type === 'login' ? 'Войти в аккаунт' : 'Создать аккаунт'}
            </h2>
            {type === 'register' && (
                <div className={styles.authForm__field}>
                    <input
                        className={styles.authForm__input}
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder=" "
                        required
                    />
                    <label className={styles.authForm__label}>
                        Имя пользователя
                    </label>
                    <img
                        src={AccountIcon}
                        className={classNames(
                            styles.authForm__inputIcon,
                            'svg-small',
                        )}
                        alt="usernameFieldIcon"
                    />
                </div>
            )}
            <div className={styles.authForm__field}>
                <input
                    className={styles.authForm__input}
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder=" "
                    required
                />
                <label className={styles.authForm__label}>Почта</label>
                <img
                    src={AtIcon}
                    className={classNames(
                        styles.authForm__inputIcon,
                        'svg-small',
                    )}
                    alt="emailFieldIcon"
                />
            </div>
            <div className={styles.authForm__field}>
                <input
                    className={styles.authForm__input}
                    type={isPasswordShow ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder=" "
                    required
                />
                <label className={styles.authForm__label}>Пароль</label>
                <img
                    src={isPasswordShow ? EyeOutlineIcon : EyeOffOutlineIcon}
                    className={classNames(
                        styles.authForm__inputIcon,
                        styles.authForm__inputIcon_password,
                        'svg-small',
                    )}
                    alt="passwordFieldIcon"
                    onClick={() => toggleIsPasswordShow()}
                />
            </div>
            {type === 'login' && (
                <a className={styles.authForm__link}>Забыли пароль?</a>
            )}
            <button
                className={classNames(
                    styles.authForm__button,
                    'button',
                    'button_accent',
                )}
                type="submit"
            >
                {type === 'register' ? 'Зарегистрироваться' : 'Войти'}
            </button>

            {type === 'login' && (
                <span className={styles.authForm__nonAccountText}>
                    Нет аккаунта?{' '}
                    <a className={styles.authForm__link} href={'/register'}>
                        Создать
                    </a>
                </span>
            )}
        </form>
    );
};
export default AuthForm;
