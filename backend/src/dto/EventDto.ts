import { UserShortDto } from '@dto/UserDto.js';

export interface EventDto {
    id: number;
    title: string;
    description?: string;
    date: Date;
    createdBy: number;
    isPublic: boolean;
    deletedAt?: Date;
}

export interface EventResponseDto {
    id: number;
    title: string;
    description?: string;
    date: Date;
    createdBy: UserShortDto;
    isPublic: boolean;
    deletedAt?: Date | null;
}
