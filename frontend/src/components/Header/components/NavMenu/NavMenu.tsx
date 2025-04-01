import styles from './NavMenu.module.scss';
import classNames from 'classnames';
import { useNavigate } from 'react-router-dom';

interface NavMenuProps {
    mobile?: boolean;
}

const NavMenu = ({ mobile = false }: NavMenuProps) => {
    const navigate = useNavigate();

    return (
        <nav
            className={classNames(
                styles.navMenu,
                { [styles.navMenu_mobile]: mobile },
                mobile ? 'visible-mobile' : 'hidden-mobile',
            )}
        >
            <a className={styles.navMenu__item} onClick={() => navigate('/')}>
                Главная
            </a>
            <a
                className={styles.navMenu__item}
                onClick={() => navigate('/events')}
            >
                События
            </a>
            <a
                className={styles.navMenu__item}
                onClick={() => navigate('/about')}
            >
                О нас
            </a>
        </nav>
    );
};

export default NavMenu;
