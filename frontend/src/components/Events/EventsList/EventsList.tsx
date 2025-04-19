import styles from './EventsList.module.scss';
import classNames from 'classnames';
import React from 'react';
import EventCard from '@components/Events/EventCard/EventCard.tsx';
import { useAppSelector } from '@app/hooks.ts';

const EventsList: React.FC = () => {
    const { events } = useAppSelector((state) => state.events);
    const { showDeleted } = useAppSelector((state) => state.ui);

    const filteredEvents = events.filter((event) =>
        showDeleted ? event.deletedAt !== null : event.deletedAt === null,
    );

    return (
        <ul className={classNames(styles.eventsList, 'container', 'block')}>
            {filteredEvents && filteredEvents.length > 0 ? (
                filteredEvents?.map((event) => (
                    <EventCard
                        key={event.id}
                        event={event}
                        className={styles.eventsList__eventCard}
                    />
                ))
            ) : (
                <p>Нет событий:(</p>
            )}
        </ul>
    );
};

export default EventsList;
