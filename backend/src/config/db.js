import Sequelize from 'sequelize';
import config from './config.js';

const sequelize = new Sequelize(
    config.db.dbName,
    config.db.user,
    config.db.password,
    {
        dialect: 'postgres',
        host: config.db.host,
        port: config.db.port,
        logging: false,
    },
);

const authenticate = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection to DB successful');
    } catch (e) {
        console.error('Error connection to DB: ', e);
    }
};

export { sequelize, authenticate };
