import styles from './EventModal.module.scss';
import React, { useState } from 'react';
import classNames from 'classnames';
import {
    AccountLockIcon,
    AccountLockOpenIcon,
    DeleteAlertIcon,
    DeleteIcon,
} from '@assets/icons/icons.ts';
import InputField from '@components/InputField/InputField.tsx';
import { useAutoResizeTextarea } from '@/hooks/useAutoResizeTextarea.tsx';
import { EventDto } from '@/dtos';
import Modal from '@components/modals/Modal/Modal.tsx';
import CustomSwitch from '@components/Switch/CustomSwitch.tsx';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    anchorRef: React.RefObject<HTMLElement | null>;
    event: EventDto;
    toggleConfirmModal: () => void;
    confirmModalButtonRef: React.RefObject<HTMLButtonElement | null>;
}

const EventModal: React.FC<ModalProps> = ({
    isOpen,
    onClose,
    anchorRef,
    event,
    toggleConfirmModal,
    confirmModalButtonRef,
}) => {
    const [title, setTitle] = useState(event.title);
    const [description, setDescription] = useState(event.description ?? '');
    const [date, setDate] = useState(event.date ?? new Date());
    const [isPublic, setIsPublic] = useState<boolean>(false);

    const textareaRef = useAutoResizeTextarea(description);

    const handleSwitchChange = (checked: boolean) => {
        setIsPublic(checked);
    };

    return (
        <>
            <Modal
                isOpen={isOpen}
                onClose={onClose}
                title={event.title}
                anchorRef={anchorRef}
            >
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
                            value={date}
                            onChange={(e) => setDate(new Date(e.target.value))}
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
                <div className={styles.eventModal__deleteButtons}>
                    <button
                        ref={confirmModalButtonRef}
                        onClick={() => toggleConfirmModal()}
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
                        onClick={() => toggleConfirmModal()}
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
                <button
                    className={classNames(
                        styles.eventModal__button,
                        'button',
                        'button_accent',
                    )}
                >
                    Сохранить
                </button>
            </Modal>
        </>
    );
};

export default EventModal;
