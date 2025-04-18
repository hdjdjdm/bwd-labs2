import styles from './EventsPage.module.scss';
import Header from '@components/Header/Header.tsx';
import classNames from 'classnames';
import { useRef, useState } from 'react';
import { PlusIcon } from '@assets/icons';
import EventModal from '@components/modals/EventModal/EventModal.tsx';
import EventPanel from '@components/Events/EventPanel/EventPanel.tsx';
import EventDto from '@dtos/EventDto.ts';
import { useAppSelector } from '@/app/hooks.ts';
import EventsList from '@components/Events/EventsList/EventsList.tsx';

const EventsPage = () => {
    const user = useAppSelector((state) => state.auth.user);

    const [isModalOpen, setIsModalOpen] = useState(false);

    const modalButtonRef = useRef<HTMLButtonElement | null>(null);

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

    const removeEventFromList = (id: number, isHardDelete: boolean = false) => {
        if (isHardDelete || !withDeleted) {
            setEvents((prevEvents) =>
                prevEvents.filter((event) => event.id !== id),
            );
        }
    };

    // const replaceEventInList = (updatedEvent: EventDto) => {
    //     if (!updatedEvent.isPublic && chosenCategory === 'public') {
    //         removeEventFromList(updatedEvent.id);
    //     }
    //
    //     setEvents((prevEvents) =>
    //         prevEvents.map((event) =>
    //             event.id === updatedEvent.id ? updatedEvent : event,
    //         ),
    //     );
    // };

    const toggleModal = () => {
        setIsModalOpen((prev) => !prev);
    };

    return (
        <div className={styles.eventsPage}>
            <Header />
            <div
                className={classNames(styles.eventsPage__inner, 'page__inner')}
            >
                {user && (
                    <EventPanel
                        modalButtonRef={modalButtonRef}
                        toggleModal={toggleModal}
                    />
                )}
                <div className={styles.eventsPage__eventsList}>
                    <EventsList />
                </div>
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
                />
            )}
        </div>
    );
};

export default EventsPage;
