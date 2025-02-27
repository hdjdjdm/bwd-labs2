import Sequelize from 'sequelize';
import bcrypt from 'bcryptjs';
import { sequelize } from '../config/db.js'
import ROLES from '../constants/roles.js'

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
    password: {
        type: Sequelize.STRING,
        allowNull: false
    },
    role: {
        type: Sequelize.ENUM(Object.values(ROLES)),
        allowNull: false,
        defaultValue: ROLES.USER
    },
    // createdAt: {
    //     type: Sequelize.DATE,
    //     defaultValue: Sequelize.NOW,
    //     allowNull: false,
    // },
    deletedAt: {
        type: Sequelize.DATE,
        allowNull: true,
    }
}, {
    paranoid: true
})

User.beforeCreate(async (user) => {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    user.password = hashedPassword;
});

User.beforeUpdate(async (user) => {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    user.password = hashedPassword;
});

User.associate = (models) => {
    User.hasMany(models.Event, { foreignKey: 'createdBy' });
};
export default User;