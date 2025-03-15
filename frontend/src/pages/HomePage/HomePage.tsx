import styles from './HomePage.module.scss';
import Header from '@components/Header/Header.tsx';
import Hero from '@pages/HomePage/components/Hero/Hero.tsx';
import classNames from 'classnames';
import FeatureBlock from '@pages/HomePage/components/FeatureBlock/FeatureBlock.tsx';

const HomePage = () => {
    const features = [
        {
            icon: 'icon-speed.svg',
            title: 'Быстро и удобно',
            description: 'Наш сайт работает мгновенно, экономя ваше время.',
        },
        {
            icon: 'icon-design.svg',
            title: 'Современный дизайн',
            description: 'Удобный интерфейс и приятная анимация.',
        },
        {
            icon: 'icon-security.svg',
            title: 'Безопасность',
            description:
                'Ваши данные защищены с использованием современных технологий.',
        },
        {
            icon: 'icon-support.svg',
            title: 'Поддержка 24/7',
            description: 'Наша команда всегда готова помочь вам.',
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
                            icon={feature.icon}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default HomePage;
