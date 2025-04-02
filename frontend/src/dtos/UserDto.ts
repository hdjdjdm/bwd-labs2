import { Roles } from '@constants/Roles.ts';

export default interface UserDto {
    id: number;
    name: string;
    email: string;
    role: Roles;
}
