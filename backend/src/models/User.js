const { Sequelize } = require('sequelize');
const { sequelize } = require('../config/db');

const User = sequelize.define('User', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
        }
    },
    createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
    },
    deletedAt: {
        type: Sequelize.DATE,
        allowNull: true,
    }
}, {
    paranoid: true
})

User.associate = (models) => {
    User.hasMany(models.Event, { foreignKey: 'createdBy' });
};
module.exports = User;