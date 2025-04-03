import {
    DataTypes,
    ForeignKey,
    NonAttribute,
    Model,
    InferAttributes,
    InferCreationAttributes,
    CreationOptional,
} from 'sequelize';
import { sequelize } from '@config/db.js';
import User from '@models/User.js';

export default class Event extends Model<InferAttributes<Event>, InferCreationAttributes<Event>> {
    declare id: CreationOptional<number>;
    declare title: string;
    declare description: string | null;
    declare date: CreationOptional<Date>;
    declare createdBy: ForeignKey<User['id']>;
    declare creator?: NonAttribute<User>;
    declare isPublic: CreationOptional<boolean>;
    declare deletedAt: CreationOptional<Date | null>;
}

Event.init(
    {
        id: {
            type: DataTypes.INTEGER,
            unique: true,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        date: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
        createdBy: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: User,
                key: 'id',
            },
            onDelete: 'CASCADE',
        },
        isPublic: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
        deletedAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },
    },
    {
        sequelize,
        modelName: 'Event',
        paranoid: true,
        timestamps: true,
    },
);
