import { Roles } from '@constants/Roles.js';
import { EventResponseDto } from '@dto/EventDto.js';
import { Genders } from '@constants/Genders.js';

export interface UserDto {
    id: number;
    email: string;
    password: string;
    username: string;
    firstName?: string;
    middleName?: string;
    lastName?: string;
    gender: Genders;
    dateOfBirth: Date;
    role: Roles;
}

export type UserShortDto = Pick<UserDto, 'id' | 'username'>;

export type UserResponseDto = Omit<UserDto, 'password'> & {
    events: EventResponseDto[];
};
