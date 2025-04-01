import styles from './AuthForm.module.scss';
import classNames from 'classnames';
import { useState } from 'react';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import InputField from '@components/InputField/InputField.tsx';
import {
    AccountIcon,
    AtIcon,
    EyeOffOutlineIcon,
    EyeOutlineIcon,
} from '@assets/icons/icons.ts';
import { showCustomToast } from '@utils/customToastUtils.ts';

type AuthFormProps =
    | { type: 'login'; onSubmit: (email: string, password: string) => void }
    | {
          type: 'register';
          onSubmit: (email: string, password: string, username: string) => void;
      };

const AuthForm: React.FC<AuthFormProps> = ({ type, onSubmit }) => {
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [isPasswordShow, setIsPasswordShow] = useState(false);

    const toggleIsPasswordShow = () => {
        setIsPasswordShow((prev) => !prev);
    };

    const handleSubmit = async (e: React.FormEvent) => {
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
                <span className={styles.authForm__input}>
                    <InputField
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        label="Имя пользователя"
                        iconSrc={AccountIcon}
                        alt="usernameFieldIcon"
                        required
                    />
                </span>
            )}
            <span className={styles.authForm__input}>
                <InputField
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    label="Почта"
                    iconSrc={AtIcon}
                    alt="emailFieldIcon"
                    required
                />
            </span>
            <span className={styles.authForm__input}>
                <InputField
                    type={isPasswordShow ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    label="Пароль"
                    iconSrc={
                        isPasswordShow ? EyeOutlineIcon : EyeOffOutlineIcon
                    }
                    alt="passwordFieldIcon"
                    onClickIcon={() => toggleIsPasswordShow()}
                    required
                />
            </span>
            {type === 'login' && (
                <a
                    onClick={() => showCustomToast('И это печально (˘･_･˘)')}
                    className={styles.authForm__link}
                >
                    Забыли пароль?
                </a>
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

            {type === 'register' && (
                <span className={styles.authForm__nonAccountText}>
                    Уже есть аккаунт?{' '}
                    <a
                        className={styles.authForm__link}
                        onClick={() => navigate('/login')}
                    >
                        Войти
                    </a>
                </span>
            )}
            {type === 'login' && (
                <span className={styles.authForm__nonAccountText}>
                    Нет аккаунта?{' '}
                    <a
                        className={styles.authForm__link}
                        onClick={() => navigate('/register')}
                    >
                        Создать
                    </a>
                </span>
            )}
        </form>
    );
};
export default AuthForm;
