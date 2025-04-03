import styles from './HomePage.module.scss';
import Header from '@components/Header/Header.tsx';
import Hero from '@pages/HomePage/components/Hero/Hero.tsx';
import classNames from 'classnames';
import FeatureBlock from '@pages/HomePage/components/FeatureBlock/FeatureBlock.tsx';

const HomePage = () => {
    const features = [
        {
            title: 'Текст 1',
            description: 'ввввввввввввввввввввв',
        },
        {
            title: 'Текст 2',
            description: 'аааааааааааааааааааааааааааааааа.',
        },
        {
            title: 'Текст 3',
            description: 'Ваыыыыыыыыыыыыыыыыыыыыыыыыыыыыыыыыыыыыый.',
        },
        {
            title: 'Текст 4',
            description: 'йаущщщщщщщщщщщщщщщщщ.',
        },
    ];

    return (
        <div className={styles.homePage}>
            <Header />
            <div className={classNames(styles.homePage__inner, 'page__inner')}>
                <Hero />
                <div className={styles.homePage__features}>
                    {features.map((feature, index) => (
                        <FeatureBlock
                            key={index}
                            title={feature.title}
                            description={feature.description}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default HomePage;
