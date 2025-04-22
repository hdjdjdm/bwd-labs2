import {
    DataTypes,
    Association,
    Model,
    NonAttribute,
    InferAttributes,
    InferCreationAttributes,
    CreationOptional,
} from 'sequelize';
import { sequelize } from '../config/db.js';
import bcrypt from 'bcryptjs';
import { Roles } from '@constants/Roles.js';
import Event from './Event.js';
import { Genders } from '@constants/Genders.js';

export default class User extends Model<
    InferAttributes<User, { omit: 'events' }>,
    InferCreationAttributes<User, { omit: 'events' }>
> {
    declare id: CreationOptional<number>;
    declare email: string;
    declare password: string;
    declare username: string;
    declare firstName: string;
    declare middleName: string;
    declare lastName: string;
    declare gender: Genders;
    declare dateOfBirth: Date;
    declare role: CreationOptional<Roles>;
    declare deletedAt: CreationOptional<Date | null>;
    declare events?: NonAttribute<Event[]>;

    declare static associations: {
        events: Association<User, Event>;
    };
}

User.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
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
        username: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        firstName: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        middleName: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        gender: {
            type: DataTypes.ENUM(...Object.values(Genders)),
            allowNull: false,
        },
        dateOfBirth: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
        role: {
            type: DataTypes.ENUM(...Object.values(Roles)),
            allowNull: false,
            defaultValue: Roles.USER,
        },
        deletedAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },
    },
    {
        sequelize,
        modelName: 'User',
        paranoid: true,
        timestamps: true,
    },
);

User.beforeCreate(async (user) => {
    user.password = await bcrypt.hash(user.password, 10);
});

User.beforeUpdate(async (user) => {
    if (user.changed('password')) {
        user.password = await bcrypt.hash(user.password, 10);
    }
});
