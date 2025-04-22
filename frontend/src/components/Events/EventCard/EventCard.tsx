import styles from './EventCard.module.scss';
import classNames from 'classnames';
import { CogIcon, InformationOutlineIcon } from '@assets/icons';
import React, { useEffect, useRef } from 'react';
import EventModal from '@components/modals/EventModal/EventModal.tsx';
import EventDto from '@dtos/EventDto.ts';
import { useAppDispatch, useAppSelector } from '@/app/hooks.ts';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { openModal } from '@app/slices/uiSlice.ts';

interface EventCardProps {
    event: EventDto;
    className?: string;
}

const EventCard: React.FC<EventCardProps> = ({ event, className }) => {
    const dispatch = useAppDispatch();
    const user = useAppSelector((state) => state.auth.user);
    const [searchParams, setSearchParams] = useSearchParams();

    const isCreator = event?.createdBy.id === user?.id;
    const isUserAdmin = user?.role === 'admin';
    const hasAccess = isCreator || isUserAdmin;

    const navigate = useNavigate();
    const modalButtonRef = useRef<HTMLImageElement | null>(null);

    useEffect(() => {
        const eventId = searchParams.get('eventId');
        if (eventId) {
            dispatch(openModal(`eventModal_${eventId}`));
        }
    }, []);

    const toggleModal = () => {
        dispatch(openModal(`eventModal_${event.id}`));

        searchParams.set('eventId', event.id.toString());
        setSearchParams(searchParams);
    };

    return (
        <div
            className={classNames(
                styles.eventCard,
                'block',
                className,
                event.isPublic && styles.eventCard_public,
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
                {hasAccess ? (
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
                        onClick={toggleModal}
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
                        onClick={toggleModal}
                    />
                )}
            </div>
            <h4 className={classNames(styles.eventCard__creator)}>
                by&nbsp;
                <u
                    className={styles.eventCard__creatorName}
                    title={event?.createdBy?.username}
                    onClick={() => navigate(`/profile/${event?.createdBy?.id}`)}
                >
                    {event?.createdBy?.username}
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

            <EventModal modalKey={`eventModal_${event.id}`} event={event} />
        </div>
    );
};

export default EventCard;
