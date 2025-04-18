import styles from './EventsList.module.scss';
import classNames from 'classnames';
import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@app/hooks.ts';
import EventCard from '@components/Events/EventCard/EventCard.tsx';
import { fetchEvents, filterEvents } from '@app/slices/eventsSlice.ts';

const EventsList: React.FC = () => {
    const dispatch = useAppDispatch();
    const userId = useAppSelector((state) => state.auth.user?.id);
    const { filteredEvents, allEvents } = useAppSelector(
        (state) => state.events,
    );
    const { chosenCategory, withDeleted } = useAppSelector((state) => state.ui);

    useEffect(() => {
        dispatch(fetchEvents());
    }, []);

    useEffect(() => {
        if (allEvents.length > 0) {
            dispatch(filterEvents({ withDeleted, chosenCategory, userId }));
        }
    }, [allEvents, chosenCategory, dispatch, userId, withDeleted]);

    return (
        <ul className={classNames(styles.eventsList, 'container', 'block')}>
            {filteredEvents.length > 0 ? (
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
