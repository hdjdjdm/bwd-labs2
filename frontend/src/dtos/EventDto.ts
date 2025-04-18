import UserDto from '@dtos/UserDto.ts';

export default interface EventDto {
    id: number;
    title: string;
    description?: string | null;
    date?: string;
    isPublic: boolean;
    deletedAt?: string | null;
    createdBy: UserDto;
}

export type EventCreateUpdateDto = Pick<
    EventDto,
    'title' | 'description' | 'date' | 'isPublic'
>;
