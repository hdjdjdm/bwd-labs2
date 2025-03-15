import styles from './Header.module.scss';
import classNames from 'classnames';
import { useNavigate } from 'react-router-dom';

const Header = () => {
    const navigate = useNavigate();

    return (
        <header className={styles.header}>
            <div className={classNames(styles.header__inner, 'container')}>
                <h1
                    className={styles.header__logo}
                    onClick={() => navigate('/')}
                >
                    SiteLogo
                </h1>
                <nav className={styles.header__nav}>
                    <button
                        className={classNames(
                            styles.header__navButton,
                            'button',
                        )}
                        onClick={() => navigate('/login')}
                    >
                        Войти
                    </button>
                    <button
                        className={classNames(
                            styles.header__navButton,
                            'button',
                            'button_accent',
                        )}
                        onClick={() => navigate('/register')}
                    >
                        Регистрация
                    </button>
                </nav>
            </div>
        </header>
    );
};

export default Header;
