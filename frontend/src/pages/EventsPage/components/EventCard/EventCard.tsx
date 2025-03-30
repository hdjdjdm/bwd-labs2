import styles from './EventCard.module.scss';
import classNames from 'classnames';
import { CogIcon } from '@assets/icons/icons.ts';
import React, { useRef, useState } from 'react';
import EventModal from '@components/modals/EventModal/EventModal.tsx';
import { EventDto } from '@/dtos';
import ConfirmModal from '@components/modals/ConfirmModal/ConfirmModal.tsx';

interface EventCardProps {
    event: EventDto;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const modalButtonRef = useRef<HTMLImageElement | null>(null);
    const toggleModal = () => {
        setIsModalOpen((prev) => !prev);
    };
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const confirmModalButtonRef = useRef<HTMLButtonElement>(null);
    const toggleConfirmModal = () => {
        setIsConfirmModalOpen((prev) => !prev);
    };

    const handleDeleteEvent = (id: number) => {
        console.log('Удалить: ', id);
    };
    return (
        <div className={classNames(styles.eventCard, 'block')}>
            <div className={styles.eventCard__head}>
                {event.date && (
                    <p className={classNames(styles.eventCard__date)}>
                        {event.date.toLocaleDateString()}
                    </p>
                )}
                <img
                    ref={modalButtonRef}
                    src={CogIcon}
                    className={classNames(
                        styles.eventCard__settingsIcon,
                        'svg',
                    )}
                    alt="settingsIcon"
                    onClick={() => toggleModal()}
                />
            </div>
            <div className={styles.eventCard__info}>
                <h2
                    className={classNames(
                        styles.eventCard__title,
                        'text-accent',
                    )}
                    title={event.title}
                >
                    {event.title}
                </h2>
            </div>

            {isModalOpen && (
                <EventModal
                    isOpen={isModalOpen}
                    onClose={toggleModal}
                    anchorRef={modalButtonRef}
                    event={event}
                    toggleConfirmModal={toggleConfirmModal}
                    confirmModalButtonRef={confirmModalButtonRef}
                />
            )}
            {isConfirmModalOpen && (
                <ConfirmModal
                    isOpen={isConfirmModalOpen}
                    onClose={toggleConfirmModal}
                    anchorRef={confirmModalButtonRef}
                    onAccept={() => handleDeleteEvent(event.id)}
                    itemName={event.title}
                />
            )}
        </div>
    );
};

export default EventCard;
