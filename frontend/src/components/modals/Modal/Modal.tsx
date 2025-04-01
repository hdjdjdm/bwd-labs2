import styles from './Modal.module.scss';
import React, { ReactNode, RefObject } from 'react';
import useClickOutside from '@/hooks/useClickOutside.tsx';
import classNames from 'classnames';
import { createPortal } from 'react-dom';
import { CloseIcon } from '@assets/icons';
import { useEscapeKey } from '@hooks/useEscapeKey.tsx';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    anchorRef: RefObject<HTMLElement | null>;
    title: string;
    modalClassName?: string;
    zIndex?: number;
    children: ReactNode;
}

const Modal: React.FC<ModalProps> = ({
    isOpen,
    onClose,
    anchorRef,
    title,
    modalClassName,
    zIndex = 1500,
    children,
}) => {
    const modalRef = useClickOutside(
        onClose,
        anchorRef,
    ) as React.RefObject<HTMLDivElement>;

    useEscapeKey(isOpen, onClose);

    if (!isOpen) return null;

    return createPortal(
        <div className="overlay" style={{ zIndex: zIndex }}>
            <div
                ref={modalRef}
                className={classNames(styles.modal, 'block', modalClassName)}
                style={{ zIndex: zIndex + 1 }}
            >
                <div className={styles.modal__inner}>
                    <div className={styles.modal__header}>
                        <h4 className={styles.modal__title}>{title}</h4>
                        <img
                            src={CloseIcon}
                            alt="closeIcon"
                            onClick={onClose}
                            className={classNames(
                                styles.modal__closeButton,
                                'svg',
                            )}
                        />
                    </div>
                    <div className={styles.modal__content}>{children}</div>
                </div>
            </div>
        </div>,
        document.body,
    );
};

export default Modal;
