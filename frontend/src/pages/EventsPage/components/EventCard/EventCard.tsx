import styles from './EventCard.module.scss';
import classNames from 'classnames';
import { CogIcon } from '@assets/icons';
import React, { useRef, useState } from 'react';
import EventModal from '@components/modals/EventModal/EventModal.tsx';
import { EventDto } from '@/dtos';
import ConfirmModal from '@components/modals/ConfirmModal/ConfirmModal.tsx';
import { parseError } from '@utils/errorUtils.ts';
import { showCustomToast } from '@utils/customToastUtils.ts';
import { deleteEvent, updateEvent } from '@api/eventService.ts';

interface EventCardProps {
    event: EventDto;
    onUpdate: (updatedEvent: EventDto) => void;
    onDelete: (id: number) => void;
}

const EventCard: React.FC<EventCardProps> = ({ event, onUpdate, onDelete }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

    const modalButtonRef = useRef<HTMLImageElement | null>(null);
    const confirmModalButtonRef = useRef<HTMLButtonElement>(null);

    const toggleModal = () => {
        setIsModalOpen((prev) => !prev);
    };

    const toggleConfirmModal = () => {
        setIsConfirmModalOpen((prev) => !prev);
    };

    const handleUpdateEvent = async (
        title: string,
        description: string,
        date: Date,
    ) => {
        if (!event?.id) {
            return;
        }

        try {
            const updatedEvent = await updateEvent(event.id, {
                title,
                description,
                date,
            });
            onUpdate(updatedEvent);
        } catch (e: unknown) {
            const { status, errorMessage } = parseError(e);
            showCustomToast(errorMessage, 'error', status.toString());
        }
    };

    const handleDeleteEvent = async (id: number) => {
        try {
            const result = await deleteEvent(id);
            if (result.status === 200) {
                onDelete(event.id);
                showCustomToast(
                    result.message,
                    'success',
                    result.status.toString(),
                );
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
        <div className={classNames(styles.eventCard, 'block')}>
            <div className={styles.eventCard__head}>
                {event.date && (
                    <p className={classNames(styles.eventCard__date)}>
                        {new Date(event.date).toLocaleDateString('ru-RU')}
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
                    onSave={handleUpdateEvent}
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
