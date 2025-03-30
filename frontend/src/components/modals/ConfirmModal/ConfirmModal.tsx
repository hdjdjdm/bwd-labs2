import styles from './ConfirmModal.module.scss';
import classNames from 'classnames';
import { RefObject } from 'react';
import Modal from '@components/modals/Modal/Modal.tsx';

type ConfirmModalProps = {
    isOpen: boolean;
    onClose: () => void;
    anchorRef: RefObject<HTMLButtonElement | null>;
    onAccept: () => void;
    afterChoice?: () => void;
    itemName: string;
    prefix?: string;
    modalClassName?: string;
    zIndex?: number;
};

const ConfirmModal = ({
    isOpen,
    onClose,
    anchorRef,
    onAccept,
    afterChoice,
    itemName,
    prefix = 'Удалить',
    modalClassName,
    zIndex,
}: ConfirmModalProps) => {
    function handleConfirm() {
        onAccept();
        afterChoice?.();
        onClose();
    }

    function handleCancel() {
        afterChoice?.();
        onClose();
    }

    return (
        <>
            <Modal
                isOpen={isOpen}
                onClose={onClose}
                title={'Подтверждение'}
                anchorRef={anchorRef}
                modalClassName={modalClassName}
                zIndex={zIndex}
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
                        onClick={handleCancel}
                    >
                        Нет
                    </button>
                </div>
            </Modal>
        </>
    );
};

export default ConfirmModal;
