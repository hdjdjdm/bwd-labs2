import 'dotenv/config';

const config = {
    db: {
        // eslint-disable-next-line no-undef
        dbName: process.env.DB_NAME,
        // eslint-disable-next-line no-undef
        user: process.env.DB_USER,
        // eslint-disable-next-line no-undef
        password: process.env.DB_PASSWORD,
        // eslint-disable-next-line no-undef
        host: process.env.DB_HOST,
        // eslint-disable-next-line no-undef
        port: process.env.DB_PORT,
    },
    server: {
        // eslint-disable-next-line no-undef
        port: process.env.PORT,
    },
    auth: {
        // eslint-disable-next-line no-undef
        jwtSecret: process.env.JWT_SECRET,
        // eslint-disable-next-line no-undef
        jwtExpiresIn: process.env.JWT_EXPIRES_IN,
    },
};

export default config;
