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
import { FieldErrors, Resolver, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { updateUserSchema, UserUpdateInput } from '@validation/user.ts';
import { updateAuthUser } from '@app/slices/authSlice.ts';
import { RegisterRequest } from '@/types';
import { Genders } from '@constants/Genders.ts';
import getLocalDateString from '@utils/getLocalDateString.ts';

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
    } = useForm<UserUpdateInput>({
        resolver: yupResolver(updateUserSchema) as Resolver<UserUpdateInput>,
        mode: 'onSubmit',
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
            setValue('email', user.email || '');
            setValue('username', user.username || '');
            setValue('firstName', user.firstName || '');
            setValue('middleName', user.middleName || '');
            setValue('lastName', user.lastName || '');
            setValue(
                'dateOfBirth',
                getLocalDateString(new Date(user.dateOfBirth)),
            );
            setValue('gender', user.gender || '');
        }
    }, [user, setValue]);

    useEffect(() => {
        if (user?.events) {
            dispatch(setEvents(user.events));
        }
    }, [user, dispatch]);

    const isUserProfile = authUser?.id === Number(id);
    const isUserAdmin = authUser?.role === 'admin';
    const hasAccess = isUserProfile || isUserAdmin;

    const onSubmit = async (data: UserUpdateInput) => {
        try {
            const updatedUser = await dispatch(
                updateUserProfile({
                    userId: Number(id),
                    updatedUserData: data,
                }),
            ).unwrap();

            dispatch(fetchUserProfile(Number(id)));

            dispatch(updateAuthUser(updatedUser));
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
                    <div className={styles.profilePage__input}>
                        <InputField
                            type="email"
                            label="Почта"
                            {...register('email')}
                            errorMessage={errors.email?.message}
                            autoComplete="email"
                            disabled={!hasAccess}
                        />
                    </div>

                    <div className={styles.profilePage__input}>
                        <InputField
                            label="Никнейм"
                            {...register('username')}
                            errorMessage={
                                (errors as FieldErrors<RegisterRequest>)
                                    .username?.message
                            }
                            autoComplete="username"
                            disabled={!hasAccess}
                        />
                    </div>
                    <div className={styles.profilePage__input}>
                        <InputField
                            label="Имя"
                            {...register('firstName')}
                            errorMessage={
                                (errors as FieldErrors<RegisterRequest>)
                                    .firstName?.message
                            }
                            autoComplete="given-name"
                            disabled={!hasAccess}
                        />
                    </div>
                    <div className={styles.profilePage__input}>
                        <InputField
                            label="Фамилия"
                            {...register('middleName')}
                            errorMessage={
                                (errors as FieldErrors<RegisterRequest>)
                                    .middleName?.message
                            }
                            autoComplete="family-name"
                            disabled={!hasAccess}
                        />
                    </div>
                    <div className={styles.profilePage__input}>
                        <InputField
                            label="Отчество"
                            {...register('lastName')}
                            errorMessage={
                                (errors as FieldErrors<RegisterRequest>)
                                    .lastName?.message
                            }
                            autoComplete="additional-name"
                            disabled={!hasAccess}
                        />
                    </div>
                    <div className={styles.profilePage__input}>
                        <InputField
                            type="date"
                            label="Дата рождения"
                            {...register('dateOfBirth', { required: true })}
                            errorMessage={
                                (errors as FieldErrors<RegisterRequest>)
                                    .dateOfBirth?.message
                            }
                            max={new Date().toISOString().split('T')[0]}
                            autoComplete="off"
                            disabled={!hasAccess}
                        />
                    </div>
                    <div className={styles.profilePage__input}>
                        <label>Пол</label>
                        <select
                            {...register('gender')}
                            className={styles.profilePage__select}
                            defaultValue={Genders.MALE}
                            disabled={!hasAccess}
                        >
                            <option value={Genders.MALE}>Мужской</option>
                            <option value={Genders.FEMALE}>Женский</option>
                        </select>
                    </div>

                    {hasAccess && (
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
                {hasAccess && <EventPanel showWithDeleted={true} />}
                <EventsList />
            </div>
        </div>
    );
};

export default ProfilePage;
