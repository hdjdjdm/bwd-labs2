import styles from './EventPanel.module.scss';
import classNames from 'classnames';
import { PlusIcon } from '@assets/icons';
import React, { useRef, useState } from 'react';
import CustomSwitch from '@components/Switch/CustomSwitch.tsx';
import { useAppDispatch, useAppSelector } from '@app/hooks.ts';
import EventModal from '@components/modals/EventModal/EventModal.tsx';
import { setShowDeleted } from '@app/slices/uiSlice.ts';

interface EventPanelProps {
    showWithDeleted?: boolean;
}

const EventPanel: React.FC<EventPanelProps> = ({ showWithDeleted }) => {
    const { showDeleted } = useAppSelector((state) => state.ui);
    const dispatch = useAppDispatch();
    const modalButtonRef = useRef(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const toggleModal = () => {
        setIsModalOpen((prev) => !prev);
    };

    const handleSwitchChange = (checked: boolean) => {
        dispatch(setShowDeleted(checked));
    };

    return (
        <div className={classNames(styles.eventPanel)}>
            <button
                ref={modalButtonRef}
                className={classNames(
                    styles.eventPanel__addEventButton,
                    'block',
                    'button',
                    'button_accent',
                )}
                type="button"
                title="Добавить событие"
                onClick={() => toggleModal()}
            >
                Добавить событие
                <img
                    src={PlusIcon}
                    alt="addEventButton"
                    className={classNames(
                        styles.eventPage__addEventIcon,
                        'svg-large',
                        'svg-white',
                    )}
                />
            </button>
            {showWithDeleted && (
                <div
                    className={classNames(
                        styles.eventPanel__withDeletedToggle,
                        'block',
                    )}
                >
                    Удаленные?&nbsp;
                    <CustomSwitch
                        checked={showDeleted}
                        onChange={handleSwitchChange}
                    />
                </div>
            )}
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

export default EventPanel;
