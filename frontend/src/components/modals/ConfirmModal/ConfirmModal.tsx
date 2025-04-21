import styles from './ConfirmModal.module.scss';
import classNames from 'classnames';
import Modal from '@components/modals/Modal/Modal.tsx';
import { useAppDispatch, useAppSelector } from '@/app/hooks.ts';
import { closeModal } from '@/app/slices/uiSlice.ts';

type ConfirmModalProps = {
    modalKey: string;
    onAccept: () => void;
    itemName: string;
    prefix?: string;
    modalClassName?: string;
};

const ConfirmModal = ({
    modalKey,
    onAccept,
    itemName,
    prefix = 'Удалить',
    modalClassName,
}: ConfirmModalProps) => {
    const dispatch = useAppDispatch();
    const isOpen = useAppSelector((state) => state.ui.modals[modalKey]);

    const handleClose = () => dispatch(closeModal(modalKey));

    const handleConfirm = () => {
        onAccept();
        handleClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            title="Подтверждение"
            modalClassName={classNames(styles.confirmModal, modalClassName)}
        >
            <span className={styles.confirmModal__text}>
                <span className={styles.confirmModal__prefix}>
                    {prefix}&nbsp;
                </span>
                <span className={styles.inlineContent}>
                    <span className={styles.confirmModal__name}>
                        "{itemName}"?
                    </span>
                </span>
            </span>
            <div className={styles.confirmModal__buttons}>
                <button
                    className={classNames(
                        styles.confirmModal__button,
                        'button',
                        'button_accent',
                    )}
                    onClick={handleConfirm}
                >
                    Да
                </button>
                <button
                    className={classNames(
                        styles.confirmModal__button,
                        'button',
                    )}
                    onClick={handleClose}
                >
                    Нет
                </button>
            </div>
        </Modal>
    );
};

export default ConfirmModal;
