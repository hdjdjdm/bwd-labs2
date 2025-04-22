import * as yup from 'yup';
import { Genders } from '@constants/Genders.ts';
import { Roles } from '@constants/Roles.ts';

const usernameSchema = yup
    .string()
    .required('Никнейм обязателен')
    .min(3, 'Никнейм должен содержать минимум 3 символа')
    .max(20, 'Никнейм должен содержать максимум 20 символов')
    .matches(/^[a-zA-Z0-9_]+$/, 'Только буквы, цифры и подчеркивания');

const humanNameSchema = yup
    .string()
    .transform((value) => (value === '' ? undefined : value))
    .min(3, 'Имя должен содержать минимум 3 символа')
    .max(20, 'Имя должен содержать максимум 20 символов')
    .matches(/^[a-zA-Zа-яА-ЯёЁ\s-]+$/, 'Только буквы, пробелы и дефисы')
    .optional();

const emailSchema = yup
    .string()
    .required('Email обязателен')
    .matches(
        /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/,
        'Некорректный email',
    );

const passwordSchema = yup
    .string()
    .required('Пароль обязателен')
    .min(6, 'Пароль должен содержать минимум 6 символов');

const dateSchema = yup
    .string()
    .required('Дата обязательна')
    .test('is-after-min', `Дата не может быть позже сегодня`, (value) => {
        if (!value) return false;
        return new Date(value) <= new Date();
    });

const genderSchema = yup.string().oneOf(Object.values(Genders));

const roleSchema = yup.string().oneOf(Object.values(Roles));

export const registerSchema = yup.object().shape({
    email: emailSchema,
    password: passwordSchema,
    username: usernameSchema,
    firstName: humanNameSchema,
    middleName: humanNameSchema,
    lastName: humanNameSchema,
    gender: genderSchema,
    dateOfBirth: dateSchema,
});

export const loginSchema = yup.object().shape({
    email: emailSchema,
    password: passwordSchema,
});

export const updateUserSchema = yup.object().shape({
    email: emailSchema.optional(),
    username: usernameSchema.optional(),
    firstName: humanNameSchema.optional(),
    middleName: humanNameSchema.optional(),
    lastName: humanNameSchema.optional(),
    gender: genderSchema.optional(),
    dateOfBirth: dateSchema.optional(),
    role: roleSchema.optional(),
});

export type UserLoginInput = yup.InferType<typeof loginSchema>;
export type UserRegisterInput = yup.InferType<typeof registerSchema>;
export type UserUpdateInput = yup.InferType<typeof updateUserSchema>;
