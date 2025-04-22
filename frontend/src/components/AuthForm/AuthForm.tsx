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
import { FieldErrors, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { loginSchema, registerSchema } from '@validation/user.ts';
import { login, register as registerThunk } from '@app/slices/authSlice.ts';
import { useAppDispatch } from '@app/hooks.ts';
import { LoginRequest, RegisterRequest } from '@/types';
import { Genders } from '@constants/Genders.ts';

interface AuthFormProps {
    type: 'login' | 'register';
}

type FormData = LoginRequest | RegisterRequest;

const AuthForm: React.FC<AuthFormProps> = ({ type }) => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [isPasswordShow, setIsPasswordShow] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>({
        resolver: yupResolver(
            type === 'register' ? registerSchema : loginSchema,
        ),
        mode: 'onSubmit',
    });

    const togglePasswordVisibility = () => {
        setIsPasswordShow((prev) => !prev);
    };

    const onSubmit = async (data: FormData) => {
        if (type === 'register') {
            await dispatch(registerThunk(data as RegisterRequest)).unwrap();
            showCustomToast('Регистрация прошла успешно!', 'success');
            navigate('/login');
        } else {
            await dispatch(login(data as LoginRequest)).unwrap();
            navigate('/events');
        }
    };

    return (
        <form
            className={classNames(styles.authForm, 'block')}
            onSubmit={handleSubmit(onSubmit)}
            noValidate
        >
            <h2 className={styles.authForm__title}>
                {type === 'login' ? 'Войти в аккаунт' : 'Создать аккаунт'}
            </h2>

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

            {type === 'register' && (
                <div className={styles.authForm__registerFields}>
                    <div className={styles.authForm__input}>
                        <InputField
                            label="Никнейм"
                            iconSrc={AccountIcon}
                            alt="usernameFieldIcon"
                            {...register('username')}
                            errorMessage={
                                (errors as FieldErrors<RegisterRequest>)
                                    .username?.message
                            }
                            autoComplete="username"
                        />
                    </div>
                    <div className={styles.authForm__input}>
                        <InputField
                            label="Имя"
                            {...register('firstName')}
                            errorMessage={
                                (errors as FieldErrors<RegisterRequest>)
                                    .firstName?.message
                            }
                            autoComplete="given-name"
                        />
                    </div>
                    <div className={styles.authForm__input}>
                        <InputField
                            label="Фамилия"
                            {...register('middleName')}
                            errorMessage={
                                (errors as FieldErrors<RegisterRequest>)
                                    .middleName?.message
                            }
                            autoComplete="family-name"
                        />
                    </div>
                    <div className={styles.authForm__input}>
                        <InputField
                            label="Отчество"
                            {...register('lastName')}
                            errorMessage={
                                (errors as FieldErrors<RegisterRequest>)
                                    .lastName?.message
                            }
                            autoComplete="additional-name"
                        />
                    </div>
                    <div className={styles.authForm__input}>
                        <InputField
                            type="date"
                            label="Дата рождения"
                            {...register('dateOfBirth', { required: true })}
                            errorMessage={
                                (errors as FieldErrors<RegisterRequest>)
                                    .dateOfBirth?.message
                            }
                            max={new Date().toISOString().split('T')[0]}
                            autoComplete="off"
                        />
                    </div>
                    <div className={styles.authForm__input}>
                        <label>Пол</label>
                        <select
                            {...register('gender')}
                            className={styles.authForm__select}
                            defaultValue={Genders.MALE}
                        >
                            <option value={Genders.MALE}>Мужской</option>
                            <option value={Genders.FEMALE}>Женский</option>
                        </select>
                    </div>
                </div>
            )}

            {type === 'login' && (
                <a
                    type="button"
                    onClick={() =>
                        showCustomToast('АХХАХАХАХАХАХАХХАХА', 'info')
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
