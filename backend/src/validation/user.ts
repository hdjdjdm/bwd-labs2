import { Genders } from '@constants/Genders.js';
import { Roles } from '@constants/Roles.js';
import { z } from 'zod';

export const idSchema = z
    .string()
    .transform((val) => parseInt(val, 10))
    .refine((val) => !isNaN(val) && val > 0, {
        message: 'ID должен быть положительным числом',
    });

export const usernameSchema = z
    .string()
    .min(3, 'Никнейм должен содержать минимум 3 символа')
    .max(20, 'Никнейм должен содержать максимум 20 символов')
    .regex(/^[a-zA-Z0-9_]+$/, 'Только буквы, цифры и подчеркивания')
    .transform((str) => str.trim());

export const humanNameSchema = z
    .string()
    .min(3, 'Имя должен содержать минимум 3 символа')
    .max(20, 'Имя должен содержать максимум 20 символа')
    .regex(/^[a-zA-Zа-яА-ЯёЁ\s-]+$/, 'Только буквы, пробелы и дефисы')
    .optional()
    .transform((str) => str?.trim());

export const emailSchema = z
    .string()
    .email('Некорректный email')
    .min(1, 'Почта обязательна')
    .transform((str) => str.trim());

export const passwordSchema = z
    .string()
    .min(6, 'Пароль должен содержать минимум 6 символов')
    .transform((str) => str.trim());

export const dateOfBirthSchema = z
    .string()
    .transform((val) => new Date(val))
    .refine(
        (val) => {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            val.setHours(0, 0, 0, 0);
            return !isNaN(val.getTime()) && val <= today;
        },
        {
            message: 'Дата не может быть позже сегодня',
        },
    );

export const genderSchema = z.nativeEnum(Genders);

export const roleSchema = z.nativeEnum(Roles);

export const registerSchema = z.object({
    email: emailSchema,
    password: passwordSchema,
    username: usernameSchema,
    firstName: humanNameSchema,
    middleName: humanNameSchema,
    lastName: humanNameSchema,
    gender: genderSchema,
    dateOfBirth: dateOfBirthSchema,
});

export const loginSchema = z.object({
    email: emailSchema,
    password: passwordSchema,
});

export const updateUserSchema = z.object({
    email: emailSchema.optional(),
    username: usernameSchema.optional(),
    firstName: humanNameSchema.optional(),
    middleName: humanNameSchema.optional(),
    lastName: humanNameSchema.optional(),
    gender: genderSchema.optional(),
    dateOfBirth: dateOfBirthSchema.optional(),
    role: roleSchema.optional(),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
