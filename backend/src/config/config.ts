import 'dotenv/config';

//todo Типы для конфига
const config = {
    db: {
        dbName: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
    },
    server: {
        port: process.env.PORT,
    },
    auth: {
        jwtSecret: process.env.JWT_SECRET,
        jwtExpiresIn: process.env.JWT_EXPIRES_IN,
    },
};

export default config;
