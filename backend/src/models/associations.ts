import User from '@models/User.js';
import Event from '@models/Event.js';

export const setupAssociations = async () => {
    User.hasMany(Event, { sourceKey: 'id', foreignKey: 'createdBy' });
    Event.belongsTo(User, { foreignKey: 'createdBy', as: 'creator' });
};
