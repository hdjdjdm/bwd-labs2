import styles from './EventList.module.scss';
import EventCard from '@pages/EventsPage/components/EventCard/EventCard.tsx';
import classNames from 'classnames';
import { EventDto } from '@/dtos';

const events: EventDto[] = [
    {
        id: 1,
        title: 'Конференция по React',
        description: 'Обсуждение новых возможностей React 19',
        date: new Date('2025-04-10'),
        createdBy: 1,
    },
    {
        id: 2,
        title: 'Встреча TypeScript разработчиков',
        description: 'Обсуждение лучших практик использования TypeScript',
        date: new Date('2025-04-15'),
        createdBy: 1,
    },
    {
        id: 3,
        title: 'Хакатон AI Solutions',
        description: 'Создание AI-проектов за 48 часов',
        date: new Date('2025-04-20'),
        createdBy: 1,
    },
    {
        id: 4,
        title: 'Онлайн-лекция по OMNeT++',
        description: 'Основы моделирования сетей в OMNeT++',
        date: new Date('2025-04-25'),
        createdBy: 1,
    },
    {
        id: 5,
        title: 'Курс по SCSS',
        description: 'Глубокое погружение в мир стилей с использованием SCSS',
        date: new Date('2025-05-02'),
        createdBy: 1,
    },
    {
        id: 6,
        title: 'Мастер-класс по Docker',
        description: 'Создание контейнеризированных приложений',
        date: new Date('2025-05-05'),
        createdBy: 1,
    },
    {
        id: 7,
        title: 'Практикум по GraphQL',
        description: 'Работа с API с использованием GraphQL',
        date: new Date('2025-05-10'),
        createdBy: 1,
    },
    {
        id: 8,
        title: 'Форум по кибербезопасности',
        description: 'Обсуждение современных угроз и методов защиты',
        date: new Date('2025-05-20'),
        createdBy: 1,
    },
];

//todo сортировка по датам
const EventList = () => {
    return (
        <ul className={classNames(styles.eventList, 'container', 'block')}>
            {events.map((event) => (
                <EventCard key={event.id} event={event} />
            ))}
        </ul>
    );
};

export default EventList;
