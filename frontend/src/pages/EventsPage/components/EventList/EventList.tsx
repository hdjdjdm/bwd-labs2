import styles from './EventList.module.scss';
import EventCard from '@pages/EventsPage/components/EventCard/EventCard.tsx';
import classNames from 'classnames';
import { EventDto } from '@/dtos';
import React from 'react';

interface EventListProps {
    events: EventDto[];
    onUpdate: (updatedEvent: EventDto) => void;
    onDelete: (id: number) => void;
}

//todo сортировка по датам
const EventList: React.FC<EventListProps> = ({
    events,
    onUpdate,
    onDelete,
}) => {
    return (
        <ul className={classNames(styles.eventList, 'container', 'block')}>
            {events.length > 0 ? (
                events?.map((event) => (
                    <EventCard
                        key={event.id}
                        event={event}
                        onUpdate={onUpdate}
                        onDelete={onDelete}
                    />
                ))
            ) : (
                <p>Нет событий:(</p>
            )}
        </ul>
    );
};

export default EventList;
