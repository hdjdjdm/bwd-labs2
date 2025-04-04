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
import EventDto from '@dtos/EventDto.ts';
import { EventModalType } from '@/types';
import ConfirmModal from '@components/modals/ConfirmModal/ConfirmModal.tsx';
import { deleteEvent, restoreEvent } from '@api/eventService.ts';
import { showCustomToast } from '@utils/customToastUtils.ts';
import { parseError } from '@utils/errorUtils.ts';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    event?: EventDto;
    type: EventModalType;
    onDelete?: (id: number, isHardDelete: boolean) => void;
    onUpdate?: (updatedEvent: EventDto) => void;
    onSave: (
        title: string,
        description: string,
        date: Date,
        isPublic: boolean,
        id?: number,
    ) => void;
}

const EventModal: React.FC<ModalProps> = ({
    isOpen,
    onClose,
    event,
    type = 'info',
    onDelete,
    onUpdate,
    onSave,
}) => {
    const [title, setTitle] = useState(event?.title ?? '');
    const [description, setDescription] = useState(event?.description ?? '');
    const [date, setDate] = useState(event?.date ?? new Date());
    const [isPublic, setIsPublic] = useState<boolean>(event?.isPublic ?? true);
    const [isConfirmModalOpen, setIsConfirmModalOpen] =
        useState<boolean>(false);
    const [confirmAction, setConfirmAction] = useState<() => void>(() => {});
    const [confirmPrefix, setConfirmPrefix] = useState<string>('');

    const confirmModalButtonRef = useRef<HTMLButtonElement>(null);
    const textareaRef = useAutoResizeTextarea(description);

    const toggleConfirmModal = (
        action?: () => void,
        actionType?: 'restore' | 'softDelete' | 'hardDelete',
    ) => {
        setConfirmAction(() => action);

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
        setIsConfirmModalOpen((prev) => !prev);
    };

    const handleSwitchChange = (checked: boolean) => {
        setIsPublic(checked);
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();

        onSave(title, description, date, isPublic, event?.id);
        onClose();
    };

    const handleDeleteEvent = async (
        id: number,
        isHardDelete: boolean = false,
    ) => {
        if (!event) return;

        try {
            const result = await deleteEvent(id, isHardDelete);
            if (result.status === 200) {
                if (isHardDelete) {
                    onDelete?.(id, true);
                } else {
                    if (result.event) {
                        onUpdate?.(result.event);
                    }
                }
                showCustomToast(
                    result.message,
                    'success',
                    result.status.toString(),
                );
                onClose();
            } else {
                showCustomToast(
                    result.message,
                    'warning',
                    result.status.toString(),
                );
            }
        } catch (e: unknown) {
            const { status, errorMessage } = parseError(e);
            showCustomToast(errorMessage, 'error', status.toString());
        }
    };

    const handleRestoreEvent = async (id: number) => {
        if (!event) return;

        try {
            const result = await restoreEvent(id);
            if (result.status === 200 && result.event) {
                if (onUpdate) {
                    onUpdate(result.event);
                }
                showCustomToast(
                    result.message,
                    'success',
                    result.status.toString(),
                );
                onClose();
            } else {
                showCustomToast(
                    result.message,
                    'warning',
                    result.status.toString(),
                );
            }
        } catch (e: unknown) {
            const { status, errorMessage } = parseError(e);
            showCustomToast(errorMessage, 'error', status.toString());
        }
    };

    return (
        <>
            <Modal
                isOpen={isOpen}
                onClose={onClose}
                title={
                    type === 'create' ? 'Добавить событие' : 'Данные события'
                }
            >
                <form className={styles.eventModal__form} onSubmit={handleSave}>
                    <div className={styles.eventModal__mainInfo}>
                        <span
                            className={classNames(
                                styles.eventModal__input,
                                styles.eventModal__input_title,
                            )}
                        >
                            <InputField
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                label="Название"
                                maxLength={100}
                                required
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
                                value={new Date(date)}
                                onChange={(e) =>
                                    setDate(new Date(e.target.value))
                                }
                                label="Дата"
                                required
                                disabled={type === 'info'}
                            />
                        </span>
                    </div>
                    <textarea
                        className={classNames(styles.eventModal__description)}
                        ref={textareaRef}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        maxLength={200}
                        placeholder={'Описание'}
                        disabled={type === 'info'}
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
                                        () =>
                                            handleDeleteEvent(event!.id, true),
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
                            onClick={handleSave}
                        >
                            {type === 'create' ? 'Добавить' : 'Сохранить'}
                        </button>
                    )}
                </form>

                {isConfirmModalOpen && event && (
                    <ConfirmModal
                        isOpen={isConfirmModalOpen}
                        onClose={() => setIsConfirmModalOpen(false)}
                        onAccept={confirmAction}
                        itemName={title}
                        prefix={confirmPrefix}
                    />
                )}
            </Modal>
        </>
    );
};

export default EventModal;
