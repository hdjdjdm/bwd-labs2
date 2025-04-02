import styles from './EventPanel.module.scss';
import classNames from 'classnames';
import { PlusIcon } from '@assets/icons';
import React, { Ref } from 'react';
import useIsScrolled from '@hooks/useIsScrolled.tsx';
import { EventPageCategory } from '@/types';

interface EventPanelProps {
    chosenCategory: EventPageCategory;
    handleCategoryChange: (category: EventPageCategory) => void;
    modalButtonRef: Ref<HTMLButtonElement>;
    toggleModal: () => void;
}

const EventPanel: React.FC<EventPanelProps> = ({
    chosenCategory,
    handleCategoryChange,
    modalButtonRef,
    toggleModal,
}) => {
    const isScrolled = useIsScrolled();

    return (
        <div className={classNames(styles.eventPanel)}>
            <span
                className={classNames(
                    styles.eventPanel__categories,
                    isScrolled ? styles.eventPanel__categories_scrolled : null,
                    'block',
                )}
            >
                <p
                    className={classNames(
                        styles.eventPanel__categoriesItem,
                        chosenCategory === 'my'
                            ? styles.eventPanel__categoriesItem_active
                            : null,
                    )}
                    onClick={() => handleCategoryChange('my')}
                >
                    Личные
                </p>
                <p
                    className={classNames(
                        styles.eventPanel__categoriesItem,
                        chosenCategory === 'public'
                            ? styles.eventPanel__categoriesItem_active
                            : null,
                    )}
                    onClick={() => handleCategoryChange('public')}
                >
                    Публичные
                </p>
            </span>
            <button
                ref={modalButtonRef}
                className={classNames(
                    styles.eventPanel__addEventButton,
                    isScrolled
                        ? styles.eventPanel__addEventButton_scrolled
                        : null,
                    'block',
                    'hidden-mobile',
                )}
                type="button"
                title="Добавить событие"
                onClick={() => toggleModal()}
            >
                <img
                    src={PlusIcon}
                    alt="addEventButton"
                    className={classNames(
                        styles.eventPage__addEventIcon,
                        'svg-large',
                    )}
                />
            </button>
        </div>
    );
};

export default EventPanel;
