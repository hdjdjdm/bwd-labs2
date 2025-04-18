import styles from './EventPanel.module.scss';
import classNames from 'classnames';
import { PlusIcon } from '@assets/icons';
import React, { Ref } from 'react';
import useIsScrolled from '@hooks/useIsScrolled.tsx';
import CustomSwitch from '@components/Switch/CustomSwitch.tsx';
import { setChosenCategory, setWithDeleted } from '@app/slices/uiSlice.ts';
import { useAppDispatch, useAppSelector } from '@app/hooks.ts';
import { EventPageCategory } from '@/types';

interface EventPanelProps {
    modalButtonRef: Ref<HTMLButtonElement>;
    toggleModal: () => void;
}

const EventPanel: React.FC<EventPanelProps> = ({
    modalButtonRef,
    toggleModal,
}) => {
    const { chosenCategory, withDeleted } = useAppSelector((state) => state.ui);
    const dispatch = useAppDispatch();
    const isScrolled = useIsScrolled();

    const handleSwitchChange = (checked: boolean) => {
        dispatch(setWithDeleted(checked));
    };

    const handleSetChosenCategory = (category: EventPageCategory) => {
        dispatch(setChosenCategory(category));
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
                    onClick={() => handleSetChosenCategory('my')}
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
                    onClick={() => handleSetChosenCategory('public')}
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
                        Скрытые?&nbsp;
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
