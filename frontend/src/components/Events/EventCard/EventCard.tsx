import styles from './EventCard.module.scss';
import classNames from 'classnames';
import { CogIcon, InformationOutlineIcon } from '@assets/icons';
import React, { useRef, useState } from 'react';
import EventModal from '@components/modals/EventModal/EventModal.tsx';
import EventDto from '@dtos/EventDto.ts';
import { useAppSelector } from '@/app/hooks.ts';
import { useNavigate } from 'react-router-dom';

interface EventCardProps {
    event: EventDto;
    className?: string;
}

const EventCard: React.FC<EventCardProps> = ({ event, className }) => {
    const user = useAppSelector((state) => state.auth.user);

    const isCreator = event?.createdBy.id === user?.id;

    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const modalButtonRef = useRef<HTMLImageElement | null>(null);

    const toggleModal = () => {
        setIsModalOpen((prev) => !prev);
    };

    return (
        <div
            className={classNames(
                styles.eventCard,
                'block',
                className,
                isCreator && styles.eventCard_my,
            )}
        >
            <div className={styles.eventCard__head}>
                {event.date && (
                    <p className={classNames(styles.eventCard__date)}>
                        {new Date(event.date).toLocaleDateString('ru-RU')}
                    </p>
                )}
                {event.deletedAt && (
                    <h6
                        className={classNames(
                            styles.eventCard__deletedAt,
                            'text-accent',
                        )}
                    >
                        Удален{' '}
                        {new Date(event.deletedAt).toLocaleDateString('ru-RU')}
                    </h6>
                )}
                {isCreator ? (
                    <img
                        ref={modalButtonRef}
                        src={CogIcon}
                        className={classNames(
                            styles.eventCard__openModalIcon,
                            styles.eventCard__openModalIcon_creator,
                            'svg',
                            'svg-accent',
                        )}
                        alt="openSettingsIcon"
                        onClick={() => toggleModal()}
                    />
                ) : (
                    <img
                        ref={modalButtonRef}
                        src={InformationOutlineIcon}
                        className={classNames(
                            styles.eventCard__openModalIcon,
                            'svg',
                            'svg-accent',
                        )}
                        alt="openInfoIcon"
                        onClick={() => toggleModal()}
                    />
                )}
            </div>
            <h4 className={classNames(styles.eventCard__creator)}>
                by&nbsp;
                <u
                    className={styles.eventCard__creatorName}
                    title={event?.createdBy?.name}
                    onClick={() => navigate(`/profile/${event?.createdBy?.id}`)}
                >
                    {event?.createdBy?.name}
                </u>
            </h4>
            <div className={styles.eventCard__info}>
                <h4
                    className={classNames(
                        styles.eventCard__title,
                        'text-accent',
                    )}
                    title={event.title}
                >
                    {event.title}
                </h4>
            </div>

            {isModalOpen && (
                <EventModal
                    isOpen={isModalOpen}
                    onClose={toggleModal}
                    event={event}
                    type={isCreator ? 'edit' : 'info'}
                />
            )}
        </div>
    );
};

export default EventCard;
