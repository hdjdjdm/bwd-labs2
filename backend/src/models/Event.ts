import { DataTypes, Model } from 'sequelize';
import { sequelize } from '@config/db.js';
import Models from './IModels.js';

export default class Event extends Model {
    public id!: number; //todo поправить на деклеир
    public title!: string;
    public description?: string;
    public date!: Date;
    public createdBy!: number;
    public createdAt?: Date;
    public updatedAt?: Date;
    public deletedAt?: Date | null;

    //todo убрать
    //todo добавить алиасы в package
    static associate(models: Models) {
        Event.belongsTo(models.User, { foreignKey: 'createdBy' });
    }
}

Event.init(
    {
        id: {
            type: DataTypes.INTEGER,
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
    },
);
