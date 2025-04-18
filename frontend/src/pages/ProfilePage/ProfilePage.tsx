import styles from './ProfilePage.module.scss';
import Header from '@components/Header/Header.tsx';
import classNames from 'classnames';

const ProfilePage = () => {
    return (
        <div className={styles.profilePage}>
            <Header />
            <div
                className={classNames(styles.profilePage__inner, 'page__inner')}
            >
                Profile
            </div>
        </div>
    );
};

export default ProfilePage;
