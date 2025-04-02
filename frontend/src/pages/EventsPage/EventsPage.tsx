import styles from './EventsPage.module.scss';
import Header from '@components/Header/Header.tsx';
import classNames from 'classnames';
import { useEffect, useRef, useState } from 'react';
import { PlusIcon } from '@assets/icons';
import EventModal from '@components/modals/EventModal/EventModal.tsx';
import { createEvent, getEvents } from '@api/eventService.ts';
import { parseError } from '@utils/errorUtils.ts';
import { showCustomToast } from '@utils/customToastUtils.ts';
import EventCard from '@pages/EventsPage/components/EventCard/EventCard.tsx';
import { EventPageCategory } from '@/types';
import EventPanel from '@pages/EventsPage/components/EventPanel/EventPanel.tsx';
import EventDto from '@dtos/EventDto.ts';

const EventsPage = () => {
    const [events, setEvents] = useState<EventDto[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [chosenCategory, setChosenCategory] =
        useState<EventPageCategory>('my');

    const modalButtonRef = useRef<HTMLButtonElement | null>(null);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const data = await getEvents(chosenCategory);
                setEvents(data);
            } catch (e: unknown) {
                const { status, errorMessage } = parseError(e);
                showCustomToast(errorMessage, 'error', status.toString());
            }
        };

        fetchEvents();
    }, [chosenCategory]);

    const updateEventInList = (updatedEvent: EventDto) => {
        setEvents((prevEvents) =>
            prevEvents.map((event) =>
                event.id === updatedEvent.id ? updatedEvent : event,
            ),
        );
    };

    const removeEventFromList = (eventId: number) => {
        setEvents((prevEvents) =>
            prevEvents.filter((event) => event.id !== eventId),
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
                <EventPanel
                    chosenCategory={chosenCategory}
                    handleCategoryChange={handleCategoryChange}
                    modalButtonRef={modalButtonRef}
                    toggleModal={toggleModal}
                />
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
                                className={styles.eventsPage__eventCard}
                            />
                        ))
                    ) : (
                        <p>Нет событий:(</p>
                    )}
                </ul>
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
            </div>

            {isModalOpen && (
                <EventModal
                    isOpen={isModalOpen}
                    onClose={toggleModal}
                    anchorRef={modalButtonRef}
                    isCreateMode={true}
                    onSave={handleAddEvent}
                />
            )}
        </div>
    );
};

export default EventsPage;
