import { Sequelize } from 'sequelize';
import { sequelize } from '../config/db.js';
import User from './User.js';
import Event from './Event.js';

const models = { User, Event };

Object.keys(models).forEach(modelName => {
    if (models[modelName].associate) {
        models[modelName].associate(models);
    }
});

export default models;
export { sequelize, models }