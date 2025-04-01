import styles from './EventsPage.module.scss';
import Header from '@components/Header/Header.tsx';
import classNames from 'classnames';
import EventList from '@pages/EventsPage/components/EventList/EventList.tsx';
import useIsScrolled from '@/hooks/useIsScrolled.tsx';
import { useEffect, useRef, useState } from 'react';
import { PlusIcon } from '@assets/icons';
import EventModal from '@components/modals/EventModal/EventModal.tsx';
import { createEvent, getEvents } from '@api/eventService.ts';
import { EventDto } from '@/dtos';
import { parseError } from '@utils/errorUtils.ts';
import { showCustomToast } from '@utils/customToastUtils.ts';

type Category = 'my' | 'public';

const EventsPage = () => {
    const [events, setEvents] = useState<EventDto[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [chosenCategory, setChosenCategory] = useState<Category>('my');
    const isScrolled = useIsScrolled();

    const modalButtonRef = useRef<HTMLButtonElement | null>(null);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const data = await getEvents();
                setEvents(data);
            } catch (e: unknown) {
                const { status, errorMessage } = parseError(e);
                showCustomToast(errorMessage, 'error', status.toString());
            }
        };

        fetchEvents();
    }, []);

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

    const handleCategoryChange = (category: Category) => {
        setChosenCategory(category);
    };

    const handleAddEvent = async (
        title: string,
        description: string,
        date: Date,
    ) => {
        try {
            const newEvent = await createEvent(title, description, date);
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
                <span
                    className={classNames(
                        styles.eventsPage__categories,
                        isScrolled
                            ? styles.eventsPage__categories_scrolled
                            : null,
                        'block',
                    )}
                >
                    <p
                        className={classNames(
                            styles.eventsPage__categoriesItem,
                            chosenCategory === 'my'
                                ? styles.eventsPage__categoriesItem_active
                                : null,
                        )}
                        onClick={() => handleCategoryChange('my')}
                    >
                        Мои
                        <span className={'hidden-mobile'}> события</span>
                    </p>
                    <p
                        className={classNames(
                            styles.eventsPage__categoriesItem,
                            chosenCategory === 'public'
                                ? styles.eventsPage__categoriesItem_active
                                : null,
                        )}
                        onClick={() => handleCategoryChange('public')}
                    >
                        Публичные
                        <span className={'hidden-mobile'}> события</span>
                    </p>
                </span>
                <EventList
                    events={events}
                    onUpdate={updateEventInList}
                    onDelete={removeEventFromList}
                />
                <button
                    ref={modalButtonRef}
                    className={classNames(
                        styles.eventsPage__addEventButton,
                        'button',
                        'block',
                    )}
                    type="button"
                    onClick={() => toggleModal()}
                >
                    <img
                        src={PlusIcon}
                        alt="addEventButton"
                        className={classNames(
                            styles.eventPage__addEventIcon,
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
