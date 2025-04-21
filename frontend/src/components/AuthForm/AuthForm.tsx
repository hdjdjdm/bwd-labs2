import styles from './AuthForm.module.scss';
import classNames from 'classnames';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InputField from '@components/InputField/InputField.tsx';
import {
    AccountIcon,
    AtIcon,
    EyeOffOutlineIcon,
    EyeOutlineIcon,
} from '@assets/icons';
import { showCustomToast } from '@utils/customToastUtils.ts';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { loginSchema, registerSchema } from '@validation/user.ts';

type AuthFormProps =
    | { type: 'login'; onSubmit: (email: string, password: string) => void }
    | {
          type: 'register';
          onSubmit: (email: string, password: string, username: string) => void;
      };

interface AuthFormData {
    email: string;
    password: string;
    username?: string;
}

const AuthForm: React.FC<AuthFormProps> = ({ type, onSubmit }) => {
    const navigate = useNavigate();
    const [isPasswordShow, setIsPasswordShow] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<AuthFormData>({
        resolver: yupResolver(
            type === 'register' ? registerSchema : loginSchema,
        ),
        mode: 'onBlur',
    });

    const togglePasswordVisibility = () => {
        setIsPasswordShow((prev) => !prev);
    };

    const onFormSubmit = (data: AuthFormData) => {
        if (type === 'register') {
            onSubmit(data.email, data.password, data.username || '');
        } else {
            onSubmit(data.email, data.password);
        }
    };

    return (
        <form
            className={classNames(styles.authForm, 'block')}
            onSubmit={handleSubmit(onFormSubmit)}
            noValidate
        >
            <h2 className={styles.authForm__title}>
                {type === 'login' ? 'Войти в аккаунт' : 'Создать аккаунт'}
            </h2>

            {type === 'register' && (
                <div className={styles.authForm__input}>
                    <InputField
                        label="Имя пользователя"
                        iconSrc={AccountIcon}
                        alt="usernameFieldIcon"
                        {...register('username')}
                        errorMessage={errors.username?.message}
                        autoComplete="username"
                    />
                </div>
            )}

            <div className={styles.authForm__input}>
                <InputField
                    type="email"
                    label="Почта"
                    iconSrc={AtIcon}
                    alt="emailFieldIcon"
                    {...register('email')}
                    errorMessage={errors.email?.message}
                    autoComplete="email"
                />
            </div>

            <div className={styles.authForm__input}>
                <InputField
                    type={isPasswordShow ? 'text' : 'password'}
                    label="Пароль"
                    iconSrc={
                        isPasswordShow ? EyeOutlineIcon : EyeOffOutlineIcon
                    }
                    alt="passwordFieldIcon"
                    onClickIcon={togglePasswordVisibility}
                    {...register('password')}
                    errorMessage={errors.password?.message}
                    autoComplete={
                        type === 'login' ? 'current-password' : 'new-password'
                    }
                />
            </div>

            {type === 'login' && (
                <a
                    type="button"
                    onClick={() =>
                        showCustomToast('Функция в разработке', 'info')
                    }
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

            <div className={styles.authForm__nonAccountText}>
                {type === 'register' ? (
                    <>
                        Уже есть аккаунт?{' '}
                        <a
                            className={styles.authForm__link}
                            onClick={() => navigate('/login')}
                        >
                            Войти
                        </a>
                    </>
                ) : (
                    <>
                        Еще нет аккаунта?{' '}
                        <a
                            className={styles.authForm__link}
                            onClick={() => navigate('/register')}
                        >
                            Создать
                        </a>
                    </>
                )}
            </div>
        </form>
    );
};

export default AuthForm;
