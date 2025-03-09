import 'dotenv/config';

interface DbConfig {
    dbName: string;
    user: string;
    password: string;
    host: string;
    port: number;
}

interface ServerConfig {
    port: number;
}

interface AuthConfig {
    jwtSecret: string;
    jwtExpiresIn: string;
}

interface AppConfig {
    db: DbConfig;
    server: ServerConfig;
    auth: AuthConfig;
}

const config: AppConfig = {
    db: {
        dbName: process.env.DB_NAME as string,
        user: process.env.DB_USER as string,
        password: process.env.DB_PASSWORD as string,
        host: process.env.DB_HOST as string,
        port: Number(process.env.DB_PORT) || 5432,
    },
    server: {
        port: Number(process.env.PORT) || 3000,
    },
    auth: {
        jwtSecret: process.env.JWT_SECRET as string,
        jwtExpiresIn: process.env.JWT_EXPIRES_IN as string,
    },
};

//todo мб сделать проверку и выбрасывать ошибки
export default config;
