import * as yup from 'yup';

const usernameSchema = yup
    .string()
    .required('Имя пользователя обязательно')
    .min(3, 'Минимум 3 символа')
    .max(20, 'Максимум 20 символов')
    .matches(/^[a-zA-Z0-9_]+$/, 'Только буквы, цифры и подчеркивания');

const emailSchema = yup
    .string()
    .required('Email обязателен')
    .matches(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, 'Некорректный email');

const passwordSchema = yup
    .string()
    .required('Пароль обязателен')
    .min(6, 'Минимум 6 символов');

export const registerSchema = yup.object().shape({
    username: usernameSchema,
    email: emailSchema,
    password: passwordSchema,
});

export const loginSchema = yup.object().shape({
    email: emailSchema,
    password: passwordSchema,
});

export const updateUserSchema = yup.object().shape({
    username: usernameSchema,
    email: emailSchema,
});
