import styles from './ProfilePage.module.scss';
import Header from '@components/Header/Header.tsx';
import classNames from 'classnames';
import EventsList from '@components/Events/EventsList/EventsList.tsx';
import InputField from '@components/InputField/InputField.tsx';
import { useAppDispatch, useAppSelector } from '@app/hooks.ts';
import { FormEvent, useEffect } from 'react';
import { fetchUserProfile } from '@app/slices/userSlice.ts';
import { useParams } from 'react-router-dom';
import { updateUser } from '@api/userService.ts';

const ProfilePage = () => {
    const dispatch = useAppDispatch();
    const { id } = useParams<{ id: string }>();
    const { user } = useAppSelector((state) => state.user);

    useEffect(() => {
        dispatch(fetchUserProfile(Number(id)));
    }, [dispatch]);

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
                <EventsList /> //todo в профиле только мои показываются
            </div>
        </div>
    );
};

export default ProfilePage;
