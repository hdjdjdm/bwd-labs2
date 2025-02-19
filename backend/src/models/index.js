const { Sequelize } = require('sequelize');
const sequelize = require('../config/db');

const models = {
    User: require('./User'),
    Event: require('./Event'),
};

Object.keys(models).forEach(modelName => {
    if (models[modelName].associate) {
        models[modelName].associate(models);
    }
});

module.exports = { sequelize, ...models };
