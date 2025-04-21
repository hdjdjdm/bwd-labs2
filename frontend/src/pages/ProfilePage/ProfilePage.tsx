import styles from './ProfilePage.module.scss';
import Header from '@components/Header/Header.tsx';
import classNames from 'classnames';
import EventsList from '@components/Events/EventsList/EventsList.tsx';
import InputField from '@components/InputField/InputField.tsx';
import { useAppDispatch, useAppSelector } from '@app/hooks.ts';
import { useEffect } from 'react';
import {
    clearUser,
    fetchUserProfile,
    updateUserProfile,
} from '@app/slices/userSlice.ts';
import { useParams } from 'react-router-dom';
import EventPanel from '@components/Events/EventPanel/EventPanel.tsx';
import { clearEvents, setEvents } from '@app/slices/eventsSlice.ts';
import { setShowDeleted } from '@app/slices/uiSlice.ts';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { updateUserSchema } from '@validation/user.ts';
import { updateAuthUser } from '@app/slices/authSlice.ts';

interface ProfileFormData {
    username: string;
    email: string;
}

const ProfilePage = () => {
    const dispatch = useAppDispatch();
    const { id } = useParams<{ id: string }>();
    const { user } = useAppSelector((state) => state.user);
    const { user: authUser } = useAppSelector((state) => state.auth);

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
    } = useForm<ProfileFormData>({
        resolver: yupResolver(updateUserSchema),
        mode: 'onBlur',
    });

    useEffect(() => {
        dispatch(fetchUserProfile(Number(id)));

        return () => {
            dispatch(clearUser());
            dispatch(clearEvents());
            dispatch(setShowDeleted(false));
        };
    }, [dispatch, id]);

    useEffect(() => {
        if (user) {
            setValue('username', user.name || '');
            setValue('email', user.email || '');
        }
    }, [user, setValue]);

    useEffect(() => {
        if (user?.events) {
            dispatch(setEvents(user.events));
        }
    }, [user, dispatch]);

    const isUserProfile = authUser?.id === Number(id);

    const onSubmit = async (data: ProfileFormData) => {
        try {
            const updatedUser = await dispatch(
                updateUserProfile({
                    userId: Number(id),
                    updatedUserData: {
                        name: data.username,
                        email: data.email,
                    },
                }),
            ).unwrap();

            dispatch(fetchUserProfile(Number(id)));

            dispatch(
                updateAuthUser({
                    name: updatedUser.name,
                    email: updatedUser.email,
                }),
            );
        } catch (e) {
            console.error('Ошибка при обновлении профиля:', e);
        }
    };

    return (
        <div className={styles.profilePage}>
            <Header />
            <div
                className={classNames(styles.profilePage__inner, 'page__inner')}
            >
                <form
                    className={classNames(styles.profilePage__form, 'block')}
                    onSubmit={handleSubmit(onSubmit)}
                    noValidate
                >
                    <h1>Профиль</h1>
                    <span
                        className={classNames(
                            styles.profilePage__input,
                            styles.profilePage__input_username,
                        )}
                    >
                        <InputField
                            label="Имя профиля"
                            {...register('username')}
                            errorMessage={errors.username?.message}
                            autoComplete="username"
                            disabled={!isUserProfile}
                        />
                    </span>

                    <span
                        className={classNames(
                            styles.profilePage__input,
                            styles.profilePage__input_email,
                        )}
                    >
                        <InputField
                            type="email"
                            label="Почта"
                            {...register('email')}
                            errorMessage={errors.email?.message}
                            autoComplete="email"
                            disabled={!isUserProfile}
                        />
                    </span>

                    {isUserProfile && (
                        <button
                            className={classNames(
                                styles.profilePage__saveButton,
                                'button',
                                'button_accent',
                            )}
                            type="submit"
                            onClick={() => handleSubmit}
                        >
                            Сохранить
                        </button>
                    )}
                </form>
                {isUserProfile && <EventPanel showWithDeleted={true} />}
                <EventsList />
            </div>
        </div>
    );
};

export default ProfilePage;
