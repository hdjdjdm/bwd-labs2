import styles from './Loader.module.scss';
import React from 'react';
import { LoadingIcon } from '@assets/icons';
import classNames from 'classnames';
import { useAppSelector } from '@app/hooks.ts';

const Loader: React.FC = () => {
    const { loading: eventsLoading } = useAppSelector((state) => state.events);
    const { loading: userLoading } = useAppSelector((state) => state.user);

    const isLoading = eventsLoading || userLoading;

    return (
        isLoading && (
            <div className={styles.loader}>
                <h2>Загрузка...</h2>
                <img
                    src={LoadingIcon}
                    alt="loadingIcon"
                    className={classNames(
                        styles.loader__spinner,
                        'svg',
                        'svg-large',
                    )}
                />
            </div>
        )
    );
};

export default Loader;
