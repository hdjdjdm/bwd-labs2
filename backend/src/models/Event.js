import Sequelize from 'sequelize';
import { sequelize } from '../config/db.js';

const Event = sequelize.define(
    'Event',
    {
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
        },
        deletedAt: {
            type: Sequelize.DATE,
            allowNull: true,
        },
    },
    {
        paranoid: true,
    },
);

Event.associate = (models) => {
    Event.belongsTo(models.User, { foreignKey: 'createdBy' });
};
export default Event;
