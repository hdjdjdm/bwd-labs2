import UserDto from '@dtos/UserDto.ts';

export default interface EventDto {
    id: number;
    title: string;
    description?: string | null;
    date?: Date;
    isPublic: boolean;
    deletedAt?: Date | null;
    createdBy: UserDto;
}
