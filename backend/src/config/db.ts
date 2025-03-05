import { Sequelize } from 'sequelize-typescript';
import config from './config';

if (!config.db.dbName || !config.db.user || !config.db.password || !config.db.host || !config.db.port) {
    throw new Error('Missing database configuration');
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
        console.log('Connection to DB successful');
    } catch (e) {
        console.error('Error connection to DB: ', e);
    }
};

export { sequelize, authenticate };
