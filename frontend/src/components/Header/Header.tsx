import styles from './Header.module.scss';
import classNames from 'classnames';
import { useNavigate } from 'react-router-dom';
import {
    AccountPlusIcon,
    ExitRunIcon,
    LoginIcon,
    LogoIcon,
    LogoMobileIcon,
} from '@assets/icons';
import { useRef, useState } from 'react';
import ConfirmModal from '@components/modals/ConfirmModal/ConfirmModal.tsx';
import NavMenu from '@components/Header/components/NavMenu/NavMenu.tsx';
import useIsScrolled from '@hooks/useIsScrolled.tsx';
import { useAppDispatch, useAppSelector } from '@/app/hooks.ts';
import { logout } from '@/app/slices/authSlice.ts';

const Header = () => {
    const isScrolled = useIsScrolled();
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const logoutButtonRef = useRef<HTMLButtonElement>(null);

    const navigate = useNavigate();
    const user = useAppSelector((state) => state.auth.user);
    const dispatch = useAppDispatch();

    const toggleConfirmModal = () => {
        setIsConfirmModalOpen(!isConfirmModalOpen);
    };

    return (
        <header
            className={classNames(
                styles.header,
                isScrolled && styles.header_scrolled,
            )}
        >
            <div className={classNames(styles.header__inner, 'container')}>
                <div className={styles.header__top}>
                    <img
                        src={isScrolled ? LogoMobileIcon : LogoIcon}
                        alt="logo"
                        className={classNames(
                            styles.header__logo,
                            'hidden-mobile',
                        )}
                        onClick={() => navigate('/')}
                    />
                    <img
                        src={LogoMobileIcon}
                        alt="logo"
                        className={classNames(
                            styles.header__logo,
                            styles.header__logo_mobile,
                            'visible-mobile',
                        )}
                        onClick={() => navigate('/')}
                    />
                    <NavMenu />
                    <div className={styles.header__buttons}>
                        {user ? (
                            <>
                                <h3
                                    className={styles.header__username}
                                    title={user.name}
                                    onClick={() =>
                                        navigate(`/profile/${user.id}`)
                                    }
                                >
                                    {user.name}
                                </h3>
                                <button
                                    ref={logoutButtonRef}
                                    onClick={toggleConfirmModal}
                                    className={classNames(
                                        styles.header__button,
                                        'button',
                                    )}
                                >
                                    <p
                                        className={classNames(
                                            styles.header__buttonText,
                                            'hidden-small-mobile',
                                        )}
                                    >
                                        Выйти
                                    </p>
                                    <img
                                        src={ExitRunIcon}
                                        alt="logoutIcon"
                                        className={classNames(
                                            styles.header__buttonIcon,
                                            'svg',
                                            'visible-small-mobile',
                                        )}
                                    />
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    className={classNames(
                                        styles.header__button,
                                        'button',
                                    )}
                                    onClick={() => navigate('/login')}
                                >
                                    <p
                                        className={classNames(
                                            styles.header__buttonText,
                                            'hidden-small-mobile',
                                        )}
                                    >
                                        Войти
                                    </p>
                                    <img
                                        src={LoginIcon}
                                        className={classNames(
                                            styles.header__buttonIcon,
                                            'svg',
                                            'visible-small-mobile',
                                        )}
                                        alt="loginIcon"
                                    />
                                </button>
                                <button
                                    className={classNames(
                                        styles.header__button,
                                        'button',
                                        'button_accent',
                                    )}
                                    onClick={() => navigate('/register')}
                                >
                                    <p
                                        className={classNames(
                                            styles.header__buttonText,
                                            'hidden-small-mobile',
                                        )}
                                    >
                                        Регистрация
                                    </p>
                                    <img
                                        src={AccountPlusIcon}
                                        className={classNames(
                                            styles.header__buttonIcon,
                                            'svg',
                                            'svg-white',
                                            'visible-small-mobile',
                                        )}
                                        alt="registerIcon"
                                    />
                                </button>
                            </>
                        )}
                    </div>
                </div>
                <NavMenu mobile={true} />
            </div>

            {isConfirmModalOpen && (
                <ConfirmModal
                    isOpen={isConfirmModalOpen}
                    onClose={toggleConfirmModal}
                    onAccept={() => dispatch(logout())}
                    itemName={user!.name}
                    prefix={'Выйти из аккаунта'}
                />
            )}
        </header>
    );
};

export default Header;
