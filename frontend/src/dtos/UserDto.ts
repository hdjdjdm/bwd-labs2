import { Roles } from '@constants/Roles.ts';
import EventDto from '@dtos/EventDto.ts';
import { Genders } from '@constants/Genders.ts';

export default interface UserDto {
    id: number;
    email: string;
    username: string;
    firstName?: string;
    middleName?: string;
    lastName?: string;
    gender: Genders;
    dateOfBirth: string;
    role: Roles;
    events: EventDto[];
}

export type UserEventDto = Pick<UserDto, 'id' | 'username'>;
