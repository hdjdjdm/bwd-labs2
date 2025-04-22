import { z } from 'zod';
import { idSchema } from '@validation/user.js';

const titleSchema = z.string().min(3, 'Минимум 3 символа').max(50, 'Максимум 50 символов');

const descriptionSchema = z.string().max(200, 'Максимум 200 символов').optional();

const isPublicSchema = z.boolean().optional();

export const createEventSchema = z.object({
    title: titleSchema,
    createdBy: idSchema,
    description: descriptionSchema,
    date: z
        .string()
        .transform((val) => new Date(val))
        .refine((val) => !isNaN(val.getTime()), 'Неверная дата')
        .refine((val) => {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            return val >= today;
        }, 'Дата не может быть раньше, чем сегодня'),
    isPublic: isPublicSchema.optional(),
});

export const getUpdateEventSchema = (minDate: string) =>
    z.object({
        title: titleSchema.optional(),
        description: descriptionSchema.optional(),
        date: z
            .string()
            .transform((val) => new Date(val))
            .refine(
                (val) => {
                    const min = new Date(minDate);
                    const date = new Date(val);
                    return date >= min;
                },
                `Дата не может быть раньше ${new Date(minDate).toLocaleDateString('ru-RU')}`,
            )
            .optional(),
        isPublic: isPublicSchema.optional(),
    });

export type CreateEventInput = z.infer<typeof createEventSchema>;
export type UpdateEventInput = z.infer<ReturnType<typeof getUpdateEventSchema>>;
