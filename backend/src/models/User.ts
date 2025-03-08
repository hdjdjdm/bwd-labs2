import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/db.js';
import bcrypt from 'bcryptjs';
import { Roles } from '@constants/Roles.js';
import IModels from './IModels.js';

export default class User extends Model {
    public id!: number;
    public name!: string;
    public email!: string;
    public password!: string;
    public role!: Roles;

    static associate(models: IModels): void {
        User.hasMany(models.Event, { foreignKey: 'createdBy' });
    }
}

User.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true,
            },
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        role: {
            type: DataTypes.ENUM(...Object.values(Roles)),
            allowNull: false,
            defaultValue: Roles.USER,
        },
    },
    {
        sequelize,
        modelName: 'User',
        paranoid: true,
    },
);

User.beforeCreate(async (user) => {
    user.password = await bcrypt.hash(user.password, 10);
});

//todo мб убрать
User.beforeUpdate(async (user) => {
    if (user.changed('password')) {
        user.password = await bcrypt.hash(user.password, 10);
    }
});
