import { Roles } from '@constants/Roles.js';

export default interface UserDTO {
    name: string;
    email: string;
    password: string;
    role?: Roles;
}
