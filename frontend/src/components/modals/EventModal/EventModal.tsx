import styles from './EventModal.module.scss';
import React, { useState } from 'react';
import classNames from 'classnames';
import {
    AccountLockIcon,
    AccountLockOpenIcon,
    DeleteAlertIcon,
    DeleteIcon,
} from '@assets/icons';
import InputField from '@components/InputField/InputField.tsx';
import { useAutoResizeTextarea } from '@/hooks/useAutoResizeTextarea.tsx';
import Modal from '@components/modals/Modal/Modal.tsx';
import CustomSwitch from '@components/Switch/CustomSwitch.tsx';
import EventDto from '@dtos/EventDto.ts';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    anchorRef: React.RefObject<HTMLElement | null>;
    event?: EventDto;
    toggleConfirmModal?: () => void;
    confirmModalButtonRef?: React.RefObject<HTMLButtonElement | null>;
    isCreateMode?: boolean;
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
    anchorRef,
    event,
    toggleConfirmModal, //todo хард делете
    confirmModalButtonRef,
    isCreateMode = false,
    onSave,
}) => {
    const [title, setTitle] = useState(event?.title ?? '');
    const [description, setDescription] = useState(event?.description ?? '');
    const [date, setDate] = useState(event?.date ?? new Date());
    const [isPublic, setIsPublic] = useState<boolean>(event?.isPublic ?? true);

    const textareaRef = useAutoResizeTextarea(description);

    const handleSwitchChange = (checked: boolean) => {
        setIsPublic(checked);
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();

        onSave(title, description, date, isPublic, event?.id);
        onClose();
    };

    return (
        <>
            <Modal
                isOpen={isOpen}
                onClose={onClose}
                title={isCreateMode ? 'Добавить событие' : 'Данные события'}
                anchorRef={anchorRef}
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
                    />
                    <span className={styles.eventModal__publicSwitch}>
                        Публичное
                        <CustomSwitch
                            checked={isPublic}
                            onChange={handleSwitchChange}
                            checkedIcon={AccountLockOpenIcon}
                            nonCheckedIcon={AccountLockIcon}
                        />
                    </span>
                    {!isCreateMode && (
                        <div className={styles.eventModal__deleteButtons}>
                            <button
                                ref={confirmModalButtonRef}
                                onClick={() => toggleConfirmModal!()}
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
                            <button
                                ref={confirmModalButtonRef}
                                onClick={() => toggleConfirmModal!()}
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
                    <button
                        className={classNames(
                            styles.eventModal__button,
                            'button',
                            'button_accent',
                        )}
                        type="submit"
                        onClick={handleSave}
                    >
                        {isCreateMode ? 'Добавить' : 'Сохранить'}
                    </button>
                </form>
            </Modal>
        </>
    );
};

export default EventModal;
