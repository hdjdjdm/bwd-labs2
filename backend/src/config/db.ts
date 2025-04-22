import { Sequelize } from 'sequelize-typescript';
import config from './config.js';

if (!config.db.dbName || !config.db.user || !config.db.password || !config.db.host || !config.db.port) {
    throw new Error('Отсутствие конфигурации базы данных');
}

const sequelize = new Sequelize(config.db.dbName, config.db.user, config.db.password, {
    dialect: 'postgres',
    host: config.db.host,
    port: Number(config.db.port),
    logging: false,
});

const authenticate: () => Promise<void> = async (): Promise<void> => {
    try {
        await sequelize.authenticate();
        console.log('Связь с DB установлена');
    } catch (e) {
        console.error('Ошибка соединения с БД: ', e);
    }
};

export { sequelize, authenticate };
