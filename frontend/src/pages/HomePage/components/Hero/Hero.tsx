import styles from './Hero.module.scss';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Scrollbar } from 'swiper/modules';
import { HeroImage1, HeroImage2, HeroImage3 } from '@assets/images/images.ts';
import classNames from 'classnames';

const Hero = () => {
    const slides = [
        {
            image: HeroImage1,
            title: 'Привет! Помнишь меня?',
            description:
                'Ищите и участвуйте в самых интересных мероприятиях вашего города.',
        },
        {
            image: HeroImage2,
            title: 'Лучшие события рядом с вами',
            description:
                'Откройте для себя новые возможности и найдите мероприятия по своим интересам.',
        },
        {
            image: HeroImage3,
            title: 'Регистрируйтесь и участвуйте',
            description:
                'Не упустите шанс стать частью чего-то большого и вдохновляющего.',
        },
    ];

    return (
        <div className={classNames(styles.hero, 'block')}>
            <Swiper
                modules={[Autoplay, Pagination, Scrollbar]}
                centeredSlides={true}
                autoplay={{
                    delay: 8000,
                    disableOnInteraction: false,
                }}
                loop={true}
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
                                <h1>{slide.title}</h1>
                                <p>{slide.description}</p>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default Hero;
