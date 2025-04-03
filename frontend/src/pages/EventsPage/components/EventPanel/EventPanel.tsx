import styles from './EventPanel.module.scss';
import classNames from 'classnames';
import { PlusIcon } from '@assets/icons';
import React, { Ref } from 'react';
import useIsScrolled from '@hooks/useIsScrolled.tsx';
import { EventPageCategory } from '@/types';
import CustomSwitch from '@components/Switch/CustomSwitch.tsx';

interface EventPanelProps {
    chosenCategory: EventPageCategory;
    handleCategoryChange: (category: EventPageCategory) => void;
    modalButtonRef: Ref<HTMLButtonElement>;
    toggleModal: () => void;
    withDeleted: boolean;
    setWithDeleted: (withDeleted: boolean) => void;
}

const EventPanel: React.FC<EventPanelProps> = ({
    chosenCategory,
    handleCategoryChange,
    modalButtonRef,
    toggleModal,
    withDeleted,
    setWithDeleted,
}) => {
    const isScrolled = useIsScrolled();

    const handleSwitchChange = (checked: boolean) => {
        setWithDeleted(checked);
    };

    return (
        <div className={classNames(styles.eventPanel)}>
            <div
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
                {chosenCategory === 'my' && (
                    <div
                        className={classNames(
                            styles.eventPanel__withDeletedToggle,
                            'block',
                        )}
                    >
                        Удаленные?&nbsp;
                        <CustomSwitch
                            checked={withDeleted}
                            onChange={handleSwitchChange}
                        />
                    </div>
                )}
            </div>
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
