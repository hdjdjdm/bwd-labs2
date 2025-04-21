import * as yup from 'yup';
import { EventFormDto } from '@/dtos';

const titleSchema = yup
    .string()
    .required('Название обязательно')
    .min(3, 'Минимум 3 символа')
    .max(50, 'Максимум 50 символов');

const descriptionSchema = yup
    .string()
    .max(200, 'Максимум 200 символов')
    .optional();

const isPublicSchema = yup.boolean().required('Укажите публичность события');

export const getEventSchema = (
    minDate: string,
): yup.ObjectSchema<EventFormDto> =>
    yup.object({
        title: titleSchema,
        description: descriptionSchema,
        date: yup
            .string()
            .required('Дата обязательна')
            .test(
                'is-after-min',
                `Дата не может быть раньше ${new Date(minDate).toLocaleDateString('ru-RU')}`,
                (value) => {
                    if (!value) return false;
                    return new Date(value) >= new Date(minDate);
                },
            ),
        isPublic: isPublicSchema,
    });
