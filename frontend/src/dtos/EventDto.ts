import { UserEventDto } from '@dtos/UserDto.ts';

export default interface EventDto {
    id: number;
    title: string;
    description?: string | null;
    date: string;
    isPublic: boolean;
    deletedAt?: string | null;
    createdBy: UserEventDto;
}

export type EventFormDto = Pick<
    EventDto,
    'title' | 'description' | 'date' | 'isPublic'
>;
