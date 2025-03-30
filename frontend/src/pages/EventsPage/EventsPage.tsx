import styles from './EventsPage.module.scss';
import Header from '@components/Header/Header.tsx';
import classNames from 'classnames';
import EventList from '@pages/EventsPage/components/EventList/EventList.tsx';
import useIsScrolled from '@/hooks/useIsScrolled.tsx';
import { useState } from 'react';

type Category = 'my' | 'public';

const EventsPage = () => {
    const [chosenCategory, setChosenCategory] = useState<Category>('my');
    const isScrolled = useIsScrolled();

    const handleCategoryChange = (category: Category) => {
        setChosenCategory(category);
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
                <EventList />
            </div>
        </div>
    );
};

export default EventsPage;
