import 'dotenv/config';
import Sequelize from 'sequelize';

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    dialect: 'postgres',
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    logging: false
});

const authenticate = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection to DB successful');
    } catch (e) {
        console.error('Error connection to DB: ', e);
    }
}

export {sequelize, authenticate};