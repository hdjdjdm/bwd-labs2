import { Roles } from '@constants/Roles.ts';
import EventDto from '@dtos/EventDto.ts';

export default interface UserDto {
    id: number;
    name: string;
    email: string;
    role: Roles;
    events: EventDto[];
}

export type UserEventDto = Pick<UserDto, 'id' | 'name'>;
