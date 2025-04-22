import styles from './EventsPage.module.scss';
import Header from '@components/Header/Header.tsx';
import classNames from 'classnames';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/hooks.ts';
import EventsList from '@components/Events/EventsList/EventsList.tsx';
import { fetchEvents } from '@app/slices/eventsSlice.ts';
import EventPanel from '@components/Events/EventPanel/EventPanel.tsx';

const EventsPage = () => {
    const user = useAppSelector((state) => state.auth.user);
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(fetchEvents(user?.role));
    }, [dispatch, user?.role]);

    return (
        <div className={styles.eventsPage}>
            <Header />
            <div
                className={classNames(styles.eventsPage__inner, 'page__inner')}
            >
                {user && <EventPanel />}
                <EventsList />
            </div>
        </div>
    );
};

export default EventsPage;
