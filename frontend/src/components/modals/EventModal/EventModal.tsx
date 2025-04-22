import styles from './EventModal.module.scss';
import React, { useEffect, useRef, useState } from 'react';
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
import EventDto, { EventCreateDto, EventFormDto } from '@dtos/EventDto.ts';
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
import { yupResolver } from '@hookform/resolvers/yup';
import { getEventSchema } from '@validation/event.ts';
import { useSearchParams } from 'react-router-dom';
import { showCustomToast } from '@utils/customToastUtils.ts';
import getLocalDateString from '@utils/getLocalDateString.ts';

interface ModalProps {
    modalKey: string;
    event?: EventDto;
}

const EventModal: React.FC<ModalProps> = ({ modalKey, event }) => {
    const isOpen = useAppSelector((state) => state.ui.modals[modalKey]);
    const dispatch = useAppDispatch();

    const user = useAppSelector((state) => state.auth.user);
    const isCreator = event?.createdBy.id === user?.id;
    const isUserAdmin = user?.role === 'admin';
    const hasAccess = isCreator || isUserAdmin;
    const isEditable = !event || hasAccess;

    const [searchParams, setSearchParams] = useSearchParams();
    const [confirmAction, setConfirmAction] = useState<() => void>(() => {});
    const [confirmPrefix, setConfirmPrefix] = useState<string>('');

    const today = getLocalDateString(new Date());
    const minDate = !event
        ? today
        : event?.date
          ? new Date(event.date).toISOString().split('T')[0]
          : today;
    const eventSchema = getEventSchema(minDate);

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        watch,
        trigger,
    } = useForm<EventFormDto>({
        resolver: yupResolver(eventSchema),
        mode: 'onBlur',
    });

    useEffect(() => {
        setValue('title', event?.title ?? '');
        setValue('description', event?.description ?? '');
        setValue(
            'date',
            event?.date ? getLocalDateString(new Date(event.date)) : today,
        );
        setValue('isPublic', event?.isPublic ?? true);
    }, [event, setValue, today]);

    const confirmModalButtonRef = useRef<HTMLButtonElement>(null);
    const textareaRef = useAutoResizeTextarea(watch('description'));
    const isPublic = watch('isPublic') ?? true;

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

    const handleClose = () => {
        dispatch(closeModal(modalKey));
        setValue('title', '');
        setValue('description', '');
        setValue('date', today);
        setValue('isPublic', true);

        searchParams.delete('eventId');
        setSearchParams(searchParams);
    };

    const onSubmit = async (data: EventFormDto) => {
        if (!user?.id) {
            showCustomToast(
                'Войдите в аккаунт для добавления событий',
                'error',
            );
            return;
        }

        const eventData: EventCreateDto = {
            ...data,
            createdBy: String(user.id),
        };

        if (!event) {
            await dispatch(addEvent(eventData));
        } else if (hasAccess && event) {
            await dispatch(updateEvent({ id: event.id, eventData }));
        }
        handleClose();
    };

    const handleDeleteEvent = async (
        id: number,
        isHardDelete: boolean = false,
    ) => {
        if (!event) return;

        await dispatch(deleteEvent({ id, isHardDelete }));
        handleClose();
    };

    const handleRestoreEvent = async (id: number) => {
        if (!event) return;

        await dispatch(restoreEvent({ id }));
        handleClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            title={!event ? 'Добавить событие' : 'Данные события'}
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
                            autoComplete="off"
                            disabled={!isEditable}
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
                            min={minDate}
                            autoComplete="off"
                            disabled={!isEditable}
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
                    disabled={!isEditable}
                    autoComplete="off"
                    placeholder="Описание"
                />

                <span className={styles.eventModal__publicField}>
                    {!isEditable ? (
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
                {hasAccess && (
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
                {isEditable && (
                    <button
                        className={classNames(
                            styles.eventModal__button,
                            'button',
                            'button_accent',
                        )}
                        type="submit"
                    >
                        {event ? 'Сохранить' : 'Добавить'}
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
