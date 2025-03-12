import User from '@models/User.js';
import Event from '@models/Event.js';

User.hasMany(Event, { foreignKey: 'createdBy' });
Event.belongsTo(User, { foreignKey: 'createdBy' });
