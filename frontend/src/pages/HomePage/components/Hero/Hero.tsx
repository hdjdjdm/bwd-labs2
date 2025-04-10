import styles from './Hero.module.scss';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination, Scrollbar } from 'swiper/modules';
import { HeroImage1, HeroImage2, HeroImage3 } from '@assets/images/images.ts';
import classNames from 'classnames';

const Hero = () => {
    const slides = [
        {
            image: HeroImage1,
            title: `Добро пожаловать!`,
            description: 'by Морзюков Максим (ПрИ-21).',
        },
        {
            image: HeroImage2,
            title: 'Для чего?',
            description:
                'На сайте вы можете создавать события и управлять ими, а так же просматривать события других людей',
        },
        {
            image: HeroImage3,
            title: 'Safe delete!',
            description:
                'У нас вы можете восстановить событие, если случайно удалили его!',
        },
    ];

    return (
        <div className={classNames(styles.hero)}>
            <Swiper
                modules={[Autoplay, Pagination, Scrollbar, Navigation]}
                centeredSlides={true}
                autoplay={{
                    delay: 8000,
                    disableOnInteraction: false,
                }}
                loop={true}
                navigation={true}
                pagination={{
                    clickable: true,
                    dynamicBullets: true,
                }}
                allowTouchMove={false}
                className={styles.hero__swiper}
            >
                {slides.map((slide, index) => (
                    <SwiperSlide
                        key={index}
                        className={styles.hero__swiperSlide}
                    >
                        <div
                            className={styles.hero__inner}
                            style={{ backgroundImage: `url(${slide.image})` }}
                        >
                            <div className={styles.hero__text}>
                                <h1 className={styles.hero__title}>
                                    {slide.title}
                                </h1>
                                <p className={styles.hero__description}>
                                    {slide.description}
                                </p>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default Hero;
