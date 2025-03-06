import User from './User';
import Event from './Event';

export default interface IModels {
    User: typeof User;
    Event: typeof Event;
}
