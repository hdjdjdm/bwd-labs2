import styles from './ConfirmModal.module.scss';
import classNames from 'classnames';
import Modal from '@components/modals/Modal/Modal.tsx';

type ConfirmModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onAccept: () => void;
    afterChoice?: () => void;
    itemName: string;
    prefix?: string;
    modalClassName?: string;
};

const ConfirmModal = ({
    isOpen,
    onClose,
    onAccept,
    itemName,
    prefix = 'Удалить',
}: ConfirmModalProps) => {
    function handleConfirm() {
        onAccept();
        onClose();
    }

    function handleCancel() {
        onClose();
    }

    return (
        <>
            <Modal
                isOpen={isOpen}
                onClose={onClose}
                title={'Подтверждение'}
                modalClassName={styles.confirmModal}
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
