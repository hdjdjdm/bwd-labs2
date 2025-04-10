import styles from './HomePage.module.scss';
import Header from '@components/Header/Header.tsx';
import Hero from '@pages/HomePage/components/Hero/Hero.tsx';
import classNames from 'classnames';
import { useContext } from 'react';
import AuthContext from '@contexts/AuthContext.tsx';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext)!;

    const handleStartButtonClick = () => {
        if (user) {
            navigate('/events');
        } else {
            navigate('/login');
        }
    };

    return (
        <div className={styles.homePage}>
            <Header />
            <div className={classNames(styles.homePage__inner, 'page__inner')}>
                <div className={styles.homePage__hero}>
                    <Hero />
                </div>
                <button
                    onClick={handleStartButtonClick}
                    className={classNames(
                        styles.homePage__startButton,
                        'button',
                        'button_accent',
                    )}
                >
                    {user ? 'Начать работу' : 'Войти в аккаунт'}
                </button>
            </div>
        </div>
    );
};

export default HomePage;
