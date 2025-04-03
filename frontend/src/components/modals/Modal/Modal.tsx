import styles from './Modal.module.scss';
import React, { ReactNode, useRef } from 'react';
import useClickOutside from '@/hooks/useClickOutside.tsx';
import classNames from 'classnames';
import { createPortal } from 'react-dom';
import { CloseIcon } from '@assets/icons';
import { useEscapeKey } from '@hooks/useEscapeKey.tsx';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    modalClassName?: string;
    zIndex?: number;
    children: ReactNode;
}

const Modal: React.FC<ModalProps> = ({
    isOpen,
    onClose,
    title,
    modalClassName,
    children,
}) => {
    const modalRef = useRef<HTMLDivElement>(null);
    useClickOutside(modalRef, onClose);

    useEscapeKey(isOpen, onClose);

    if (!isOpen) return null;

    return createPortal(
        <div className="overlay">
            <div
                ref={modalRef}
                className={classNames(
                    styles.modal,
                    'block',
                    'modal',
                    modalClassName,
                )}
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
