import styles from './AboutPage.module.scss';
import classNames from 'classnames';
import Header from '@components/Header/Header.tsx';
import { NotFoundImage } from '@assets/images/images.ts';

const AboutPage = () => {
    return (
        <div className={styles.aboutPage}>
            <Header />
            <div className={classNames(styles.aboutPage__inner, 'page__inner')}>
                <div
                    className={classNames(
                        styles.aboutPage__info,
                        'container',
                        'block',
                    )}
                >
                    <img
                        src={NotFoundImage}
                        className={styles.aboutPage__image}
                        alt="myImage"
                    />
                    <div className={styles.aboutPage__text}>
                        <h3>Добро пожаловать на мою страничку))) 😁</h3>
                        <p></p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutPage;
