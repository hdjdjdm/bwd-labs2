import styles from './HomePage.module.scss';
import Header from '@components/Header/Header.tsx';
import Hero from '@pages/HomePage/components/Hero/Hero.tsx';
import classNames from 'classnames';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '@/app/hooks.ts';

const HomePage = () => {
    const navigate = useNavigate();
    const user = useAppSelector((state) => state.auth.user);

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
