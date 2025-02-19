const { Sequelize } = require('sequelize');
const { sequelize } = require('../config/db');

const Event = sequelize.define('Event', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    title: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    description: {
        type: Sequelize.TEXT,
        allowNull: true,
    },
    date: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
    },
    createdBy: {
        type: Sequelize.INTEGER,
        allowNull: false,
    }
}, {
    timestamps: false
});

Event.associate = (models) => {
    Event.belongsTo(models.User, { foreignKey: 'createdBy' });
};
module.exports = Event;