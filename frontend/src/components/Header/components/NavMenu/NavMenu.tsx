import styles from './NavMenu.module.scss';
import classNames from 'classnames';
import { useLocation, useNavigate } from 'react-router-dom';

interface NavMenuProps {
    mobile?: boolean;
}

const pages = [
    { label: 'Главная', path: '/' },
    { label: 'События', path: '/events' },
    { label: 'О нас', path: '/about' },
];

const NavMenu = ({ mobile = false }: NavMenuProps) => {
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <nav
            className={classNames(
                styles.navMenu,
                { [styles.navMenu_mobile]: mobile },
                mobile ? 'visible-mobile' : 'hidden-mobile',
            )}
        >
            {pages.map(({ label, path }) => (
                <a
                    key={path}
                    className={classNames(styles.navMenu__item, {
                        [styles.navMenu__item_active]:
                            location.pathname === path,
                    })}
                    onClick={() => navigate(path)}
                >
                    {label}
                </a>
            ))}
        </nav>
    );
};

export default NavMenu;
