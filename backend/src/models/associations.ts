import User from '@models/User.js';
import Event from '@models/Event.js';

export const setupAssociations = async () => {
    User.hasMany(Event, {
        foreignKey: 'createdBy',
        as: 'events',
    });

    Event.belongsTo(User, {
        foreignKey: 'createdBy',
        as: 'creator',
    });
};
