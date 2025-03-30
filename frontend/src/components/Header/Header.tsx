import styles from './Header.module.scss';
import classNames from 'classnames';
import { useNavigate } from 'react-router-dom';
import {
    AccountPlusIcon,
    LoginIcon,
    LogoIcon,
    LogoMobileIcon,
} from '@assets/icons/icons.ts';

const Header = () => {
    const navigate = useNavigate();

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
                    <div className={styles.header__authButtons}>
                        <button
                            className={classNames(
                                styles.header__authButton,
                                'button',
                            )}
                            onClick={() => navigate('/login')}
                        >
                            <p
                                className={classNames(
                                    styles.header__authButtonText,
                                    'hidden-small-mobile',
                                )}
                            >
                                Войти
                            </p>
                            <img
                                src={LoginIcon}
                                className={classNames(
                                    styles.header__authButtonIcon,
                                    'svg',
                                    'visible-small-mobile',
                                )}
                                alt="loginIcon"
                            />
                        </button>
                        <button
                            className={classNames(
                                styles.header__authButton,
                                'button',
                                'button_accent',
                            )}
                            onClick={() => navigate('/register')}
                        >
                            <p
                                className={classNames(
                                    styles.header__authButtonText,
                                    'hidden-small-mobile',
                                )}
                            >
                                Регистрация
                            </p>
                            <img
                                src={AccountPlusIcon}
                                className={classNames(
                                    styles.header__authButtonIcon,
                                    'svg',
                                    'svg-white',
                                    'visible-small-mobile',
                                )}
                                alt="registerIcon"
                            />
                        </button>
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
