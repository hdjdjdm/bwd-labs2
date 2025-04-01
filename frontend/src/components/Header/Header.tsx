import styles from './Header.module.scss';
import classNames from 'classnames';
import { useNavigate } from 'react-router-dom';
import {
    AccountPlusIcon,
    ExitRunIcon,
    LoginIcon,
    LogoIcon,
    LogoMobileIcon,
} from '@assets/icons/icons.ts';
import { useContext, useEffect } from 'react';
import { AuthContext } from '@/contexts/AuthContext.tsx';

const Header = () => {
    const navigate = useNavigate();
    const auth = useContext(AuthContext);
    if (!auth) {
        throw new Error('AuthContext must be used within an AuthProvider');
    }

    const { user, logout } = auth;

    useEffect(() => {}, [user]);

    return (
        <header className={styles.header}>
            <div className={classNames(styles.header__inner, 'container')}>
                <div className={styles.header__top}>
                    <img
                        src={LogoIcon}
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
                    <nav
                        className={classNames(
                            styles.header__nav,
                            'hidden-mobile',
                        )}
                    >
                        <a
                            className={styles.header__navItem}
                            onClick={() => navigate('/')}
                        >
                            Главная
                        </a>
                        <a
                            className={styles.header__navItem}
                            onClick={() => navigate('/events')}
                        >
                            События
                        </a>
                        <a
                            className={styles.header__navItem}
                            onClick={() => navigate('/about')}
                        >
                            О нас
                        </a>
                    </nav>
                    <div className={styles.header__buttons}>
                        {user ? (
                            <>
                                <span className={styles.header__username}>
                                    {user.username}
                                </span>
                                <button
                                    onClick={logout}
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
                <nav
                    className={classNames(
                        styles.header__nav,
                        styles.header__nav_mobile,
                        'visible-mobile',
                    )}
                >
                    <a
                        className={styles.header__navItem}
                        onClick={() => navigate('/')}
                    >
                        Главная
                    </a>
                    <a
                        className={styles.header__navItem}
                        onClick={() => navigate('/events')}
                    >
                        События
                    </a>
                    <a
                        className={styles.header__navItem}
                        onClick={() => navigate('/about')}
                    >
                        О нас
                    </a>
                </nav>
            </div>
        </header>
    );
};

export default Header;
