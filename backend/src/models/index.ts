import { sequelize } from '@config/db.js';
import User from './User.js';
import Event from './Event.js';
import IModels from './IModels.js';

const models: IModels = { User, Event };

Object.values(models).forEach((model: IModels): void => {
    if ('associate' in model && typeof model.associate === 'function') {
        model.associate(models);
    }
});

export { sequelize, models };
