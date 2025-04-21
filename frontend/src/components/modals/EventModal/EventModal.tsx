import styles from './EventModal.module.scss';
import React, { useRef, useState } from 'react';
import classNames from 'classnames';
import {
    AccountLockIcon,
    AccountLockOpenIcon,
    DeleteAlertIcon,
    DeleteIcon,
    DeleteRestoreIcon,
} from '@assets/icons';
import InputField from '@components/InputField/InputField.tsx';
import { useAutoResizeTextarea } from '@/hooks/useAutoResizeTextarea.tsx';
import Modal from '@components/modals/Modal/Modal.tsx';
import CustomSwitch from '@components/Switch/CustomSwitch.tsx';
import EventDto, { EventCreateUpdateDto } from '@dtos/EventDto.ts';
import { EventModalType } from '@/types';
import ConfirmModal from '@components/modals/ConfirmModal/ConfirmModal.tsx';
import {
    addEvent,
    deleteEvent,
    restoreEvent,
    updateEvent,
} from '@app/slices/eventsSlice.ts';
import { useAppDispatch, useAppSelector } from '@app/hooks.ts';
import { closeModal, openModal } from '@app/slices/uiSlice.ts';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

interface ModalProps {
    modalKey: string;
    event?: EventDto;
    type: EventModalType;
}

interface EventFormData {
    title: string;
    description?: string;
    date: string;
    isPublic: boolean;
}

const eventSchema: yup.ObjectSchema<EventFormData> = yup.object({
    title: yup
        .string()
        .required('Название обязательно')
        .min(3, 'Минимум 3 символа')
        .max(100, 'Максимум 100 символов'),
    description: yup.string().max(200, 'Максимум 200 символов').optional(),
    date: yup.string().required('Дата обязательна'),
    isPublic: yup.boolean().required('Укажите публичность события'),
});

const EventModal: React.FC<ModalProps> = ({
    modalKey,
    event,
    type = 'info',
}) => {
    const isOpen = useAppSelector((state) => state.ui.modals[modalKey]);
    const dispatch = useAppDispatch();
    const [confirmAction, setConfirmAction] = useState<() => void>(() => {});
    const [confirmPrefix, setConfirmPrefix] = useState<string>('');

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        watch,
        trigger,
    } = useForm<EventFormData>({
        resolver: yupResolver(eventSchema),
        mode: 'onBlur',
        defaultValues: {
            title: event?.title ?? '',
            description: event?.description ?? '',
            date: event?.date
                ? new Date(event.date).toISOString().split('T')[0]
                : new Date().toISOString().split('T')[0],
            isPublic: event?.isPublic ?? true,
        },
    });

    const confirmModalButtonRef = useRef<HTMLButtonElement>(null);
    const textareaRef = useAutoResizeTextarea(watch('description'));
    const isPublic = watch('isPublic');

    const toggleConfirmModal = (
        action?: () => void,
        actionType?: 'restore' | 'softDelete' | 'hardDelete',
    ) => {
        if (!action) return;

        setConfirmAction(() => () => {
            action();
            setConfirmAction(() => {});
        });

        switch (actionType) {
            case 'restore':
                setConfirmPrefix('Восстановить');
                break;
            case 'hardDelete':
                setConfirmPrefix('Удалить навсегда');
                break;
            default:
                setConfirmPrefix('Переместить в удаленные');
        }

        dispatch(openModal('confirmDelete'));
    };

    const handleSwitchChange = async (checked: boolean) => {
        setValue('isPublic', checked);
        await trigger('isPublic');
    };

    const onClose = () => {
        dispatch(closeModal(modalKey));
    };

    const onSubmit = async (data: EventFormData) => {
        const eventData: EventCreateUpdateDto = {
            title: data.title,
            description: data.description,
            date: new Date(data.date).toString(),
            isPublic: data.isPublic,
        };

        if (type === 'create') {
            await dispatch(addEvent(eventData));
        } else if (type === 'edit' && event) {
            await dispatch(updateEvent({ id: event.id, eventData }));
        }
        onClose();
    };

    const handleDeleteEvent = async (
        id: number,
        isHardDelete: boolean = false,
    ) => {
        if (!event) return;

        await dispatch(deleteEvent({ id, isHardDelete }));
        onClose();
    };

    const handleRestoreEvent = async (id: number) => {
        if (!event) return;

        await dispatch(restoreEvent({ id }));
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={type === 'create' ? 'Добавить событие' : 'Данные события'}
        >
            <form
                className={styles.eventModal__form}
                onSubmit={handleSubmit(onSubmit)}
                noValidate
            >
                <div className={styles.eventModal__mainInfo}>
                    <span
                        className={classNames(
                            styles.eventModal__input,
                            styles.eventModal__input_title,
                        )}
                    >
                        <InputField
                            label="Название"
                            {...register('title', {
                                required: true,
                                maxLength: 100,
                            })}
                            errorMessage={errors.title?.message}
                            disabled={type === 'info'}
                        />
                    </span>
                    <span
                        className={classNames(
                            styles.eventModal__input,
                            styles.eventModal__input_date,
                        )}
                    >
                        <InputField
                            type="date"
                            label="Дата"
                            {...register('date', { required: true })}
                            errorMessage={errors.date?.message}
                            disabled={type === 'info'}
                        />
                    </span>
                </div>
                <textarea
                    className={classNames(
                        styles.eventModal__description,
                        errors.description &&
                            styles.eventModal__description_error,
                    )}
                    {...register('description')}
                    ref={(e) => {
                        textareaRef.current = e;
                        register('description').ref(e);
                    }}
                    onChange={(e) => {
                        register('description').onChange(e);
                        if (textareaRef.current) {
                            textareaRef.current.style.height = 'auto';
                            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
                        }
                    }}
                    disabled={type === 'info'}
                    placeholder="Описание"
                />

                <span className={styles.eventModal__publicField}>
                    {type === 'info' ? (
                        <>
                            <h5
                                className={classNames(
                                    styles.eventModal__publicValue,
                                    styles.eventModal__publicValue_active,
                                )}
                            >
                                {isPublic ? 'Публичное' : 'Приватное'}
                            </h5>
                            <img
                                src={
                                    isPublic
                                        ? AccountLockOpenIcon
                                        : AccountLockIcon
                                }
                                alt="publicEventIcon"
                                className={classNames(
                                    styles.eventModal__publicIcon,
                                    'svg',
                                    'svg-accent',
                                )}
                            />
                        </>
                    ) : (
                        <>
                            <h5
                                className={classNames(
                                    styles.eventModal__publicValue,
                                    !isPublic &&
                                        styles.eventModal__publicValue_active,
                                )}
                            >
                                Приватное
                            </h5>
                            <CustomSwitch
                                checked={isPublic}
                                onChange={handleSwitchChange}
                                checkedIcon={AccountLockOpenIcon}
                                nonCheckedIcon={AccountLockIcon}
                            />
                            <h5
                                className={classNames(
                                    styles.eventModal__publicValue,
                                    isPublic &&
                                        styles.eventModal__publicValue_active,
                                )}
                            >
                                Публичное
                            </h5>
                        </>
                    )}
                </span>
                {type === 'edit' && (
                    <div className={styles.eventModal__deleteButtons}>
                        {event?.deletedAt ? (
                            <button
                                ref={confirmModalButtonRef}
                                onClick={() =>
                                    toggleConfirmModal(
                                        () => handleRestoreEvent(event.id),
                                        'restore',
                                    )
                                }
                                type="button"
                                className={classNames(
                                    styles.eventModal__button_delete,
                                    styles.eventModal__button,
                                    'button',
                                )}
                            >
                                Восстановить
                                <img
                                    src={DeleteRestoreIcon}
                                    alt="restoreIcon"
                                    className="svg-small"
                                />
                            </button>
                        ) : (
                            <button
                                ref={confirmModalButtonRef}
                                onClick={() =>
                                    toggleConfirmModal(
                                        () => handleDeleteEvent(event!.id),
                                        'softDelete',
                                    )
                                }
                                type="button"
                                className={classNames(
                                    styles.eventModal__button_delete,
                                    styles.eventModal__button,
                                    'button',
                                )}
                            >
                                Удалить
                                <img
                                    src={DeleteIcon}
                                    alt="softDeleteIcon"
                                    className="svg-small"
                                />
                            </button>
                        )}
                        <button
                            ref={confirmModalButtonRef}
                            onClick={() =>
                                toggleConfirmModal(
                                    () => handleDeleteEvent(event!.id, true),
                                    'hardDelete',
                                )
                            }
                            type="button"
                            className={classNames(
                                styles.eventModal__button,
                                styles.eventModal__button_delete,
                                'button',
                            )}
                        >
                            Удалить навсегда
                            <img
                                src={DeleteAlertIcon}
                                alt="hardDeleteIcon"
                                className="svg-small"
                            />
                        </button>
                    </div>
                )}
                {type !== 'info' && (
                    <button
                        className={classNames(
                            styles.eventModal__button,
                            'button',
                            'button_accent',
                        )}
                        type="submit"
                    >
                        {type === 'create' ? 'Добавить' : 'Сохранить'}
                    </button>
                )}
            </form>

            <ConfirmModal
                modalKey="confirmDelete"
                onAccept={confirmAction}
                itemName={watch('title')}
                prefix={confirmPrefix}
            />
        </Modal>
    );
};

export default EventModal;
