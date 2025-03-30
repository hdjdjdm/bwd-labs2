import styles from './NotFoundPage.module.scss';
import classNames from 'classnames';
import { useNavigate } from 'react-router-dom';
import { NotFoundImage } from '@assets/images/images.ts';

const NotFoundPage = () => {
    const navigate = useNavigate();

    const goBack = () => {
        if (window.history.length > 1) {
            navigate(-1);
        } else {
            navigate('/');
        }
    };

    return (
        <div className={styles.notFoundPage}>
            <div
                className={classNames(
                    styles.notFoundPage__inner,
                    'page__inner',
                )}
            >
                <img
                    className={styles.notFoundPage__image}
                    src={NotFoundImage}
                    alt="notFoundImage"
                />
                <div className={classNames(styles.notFoundPage__info, 'block')}>
                    <h1
                        className={classNames(
                            styles.notFoundPage__title,
                            'text-accent',
                        )}
                    >
                        404!
                    </h1>
                    <h2>Страница не найдена</h2>
                    <button
                        className={classNames(
                            styles.notFoundPage__button,
                            'button',
                            'button_accent',
                        )}
                        onClick={goBack}
                    >
                        {window.history.length > 1 ? (
                            <>Вернуться назад</>
                        ) : (
                            <>На главную страницу</>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NotFoundPage;
