import { sequelize } from '../config/db';
import User from './User';
import Event from './Event';
import IModels from './IModels';

const models: IModels = { User, Event };

Object.values(models).forEach((model: IModels): void => {
    if ('associate' in model && typeof model.associate === 'function') {
        model.associate(models);
    }
});

export default models;
export { sequelize, models };
