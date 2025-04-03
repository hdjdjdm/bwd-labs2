import styles from './EventsPage.module.scss';
import Header from '@components/Header/Header.tsx';
import classNames from 'classnames';
import { useContext, useEffect, useRef, useState } from 'react';
import { PlusIcon } from '@assets/icons';
import EventModal from '@components/modals/EventModal/EventModal.tsx';
import { createEvent, getEvents } from '@api/eventService.ts';
import { parseError } from '@utils/errorUtils.ts';
import { showCustomToast } from '@utils/customToastUtils.ts';
import EventCard from '@pages/EventsPage/components/EventCard/EventCard.tsx';
import { EventPageCategory } from '@/types';
import EventPanel from '@pages/EventsPage/components/EventPanel/EventPanel.tsx';
import EventDto from '@dtos/EventDto.ts';
import authContext from '@contexts/AuthContext.tsx';

const EventsPage = () => {
    const { user } = useContext(authContext)!;

    const [events, setEvents] = useState<EventDto[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [chosenCategory, setChosenCategory] =
        useState<EventPageCategory>('public');
    const [withDeleted, setWithDeleted] = useState<boolean>(false);

    const modalButtonRef = useRef<HTMLButtonElement | null>(null);
    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const data = await getEvents(chosenCategory, withDeleted);
                setEvents(data);
            } catch (e: unknown) {
                const { status, errorMessage } = parseError(e);
                showCustomToast(errorMessage, 'error', status.toString());
            }
        };

        fetchEvents();
    }, [chosenCategory, withDeleted]);

    const updateEventInList = (updatedEvent: EventDto) => {
        setEvents((prevEvents) => {
            if (updatedEvent.deletedAt === null && !withDeleted) {
                return [...prevEvents, updatedEvent];
            }

            if (updatedEvent.deletedAt && !withDeleted) {
                return prevEvents.filter(
                    (event) => event.id !== updatedEvent.id,
                );
            }

            return prevEvents.map((event) =>
                event.id === updatedEvent.id ? updatedEvent : event,
            );
        });
    };

    const removeEventFromList = (id: number, isHardDelete: boolean) => {
        if (isHardDelete || !withDeleted) {
            setEvents((prevEvents) =>
                prevEvents.filter((event) => event.id !== id),
            );
        }
    };

    const replaceEventInList = (updatedEvent: EventDto) => {
        setEvents((prevEvents) =>
            prevEvents.map((event) =>
                event.id === updatedEvent.id ? updatedEvent : event,
            ),
        );
    };

    const toggleModal = () => {
        setIsModalOpen((prev) => !prev);
    };

    const handleCategoryChange = (category: EventPageCategory) => {
        setChosenCategory(category);
    };

    const handleAddEvent = async (
        title: string,
        description: string,
        date: Date,
        isPublic: boolean,
    ) => {
        try {
            const newEvent = await createEvent(
                title,
                description,
                date,
                isPublic,
            );
            setEvents((prevEvents) => [...prevEvents, newEvent]);
            showCustomToast(`Событие '${title}' добавлено`, 'success');
        } catch (e: unknown) {
            const { status, errorMessage } = parseError(e);
            showCustomToast(errorMessage, 'error', status.toString());
        }
    };

    return (
        <div className={styles.eventsPage}>
            <Header />
            <div
                className={classNames(styles.eventsPage__inner, 'page__inner')}
            >
                {user && (
                    <EventPanel
                        chosenCategory={chosenCategory}
                        handleCategoryChange={handleCategoryChange}
                        modalButtonRef={modalButtonRef}
                        toggleModal={toggleModal}
                        withDeleted={withDeleted}
                        setWithDeleted={setWithDeleted}
                    />
                )}
                <ul
                    className={classNames(
                        styles.eventsPage__eventList,
                        'container',
                        'block',
                    )}
                >
                    {events.length > 0 ? (
                        events?.map((event) => (
                            <EventCard
                                key={event.id}
                                event={event}
                                onUpdate={updateEventInList}
                                onDelete={removeEventFromList}
                                onReplace={replaceEventInList}
                                className={styles.eventsPage__eventCard}
                            />
                        ))
                    ) : (
                        <p>Нет событий:(</p>
                    )}
                </ul>
                {user && (
                    <button
                        ref={modalButtonRef}
                        className={classNames(
                            styles.eventsPage__addEventButton,
                            styles.eventsPage__addEventButton_mobile,
                            'block',
                            'visible-mobile',
                        )}
                        type="button"
                        title="Добавить событие"
                        onClick={() => toggleModal()}
                    >
                        <img
                            src={PlusIcon}
                            alt="addEventButton"
                            className={classNames(
                                styles.eventsPage__addEventIcon,
                                'svg-large',
                                'svg-accent',
                            )}
                        />
                    </button>
                )}
            </div>

            {isModalOpen && (
                <EventModal
                    isOpen={isModalOpen}
                    onClose={toggleModal}
                    type={'create'}
                    onSave={handleAddEvent}
                />
            )}
        </div>
    );
};

export default EventsPage;
