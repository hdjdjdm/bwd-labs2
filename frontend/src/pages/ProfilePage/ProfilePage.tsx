import styles from './ProfilePage.module.scss';
import Header from '@components/Header/Header.tsx';
import classNames from 'classnames';
import EventsList from '@components/Events/EventsList/EventsList.tsx';
import InputField from '@components/InputField/InputField.tsx';
import { useAppDispatch, useAppSelector } from '@app/hooks.ts';
import { FormEvent, useEffect } from 'react';
import { clearUser, fetchUserProfile } from '@app/slices/userSlice.ts';
import { useParams } from 'react-router-dom';
import { updateUser } from '@api/userService.ts';
import EventPanel from '@components/Events/EventPanel/EventPanel.tsx';
import { clearEvents, setEvents } from '@app/slices/eventsSlice.ts';
import { setShowDeleted } from '@app/slices/uiSlice.ts';

const ProfilePage = () => {
    const dispatch = useAppDispatch();
    const { id } = useParams<{ id: string }>();
    const { user } = useAppSelector((state) => state.user);
    const { user: authUser } = useAppSelector((state) => state.auth);

    useEffect(() => {
        dispatch(fetchUserProfile(Number(id)));

        return () => {
            dispatch(clearUser());
            dispatch(clearEvents());
            dispatch(setShowDeleted(false));
        };
    }, [dispatch, id]);

    useEffect(() => {
        if (user?.events) {
            dispatch(setEvents(user.events));
        }
    }, [user, dispatch]);

    const isUserProfile = authUser?.id === Number(id);

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        dispatch(updateUser(id));
    };

    return (
        <div className={styles.profilePage}>
            <Header />
            <div
                className={classNames(styles.profilePage__inner, 'page__inner')}
            >
                <h1>Профиль</h1>
                <form
                    className={styles.profilePage__form}
                    onSubmit={(e) => {
                        handleSubmit(e);
                    }}
                >
                    <span
                        className={classNames(
                            styles.profilePage__input,
                            styles.profilePage__input_username,
                        )}
                    >
                        <InputField
                            type="text"
                            value={user?.name || ''}
                            onChange={(e) => console.log(e.target.value)}
                            label="Имя профиля"
                            required
                        />
                    </span>

                    <button
                        className={classNames(
                            styles.profilePage__button,
                            'button',
                            'button_accent',
                        )}
                        type="submit"
                        onClick={() => handleSubmit}
                    >
                        Сохранить
                    </button>
                </form>
                {isUserProfile && <EventPanel showWithDeleted={true} />}
                <EventsList />
            </div>
        </div>
    );
};

export default ProfilePage;
