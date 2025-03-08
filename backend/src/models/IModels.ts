import User from './User.js';
import Event from './Event.js';

export default interface IModels {
    User: typeof User;
    Event: typeof Event;
}
