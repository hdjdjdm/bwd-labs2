import { UserResponseDto } from '@dto/UserDto.js';

export interface EventDto {
    id: number;
    title: string;
    description?: string;
    date: Date;
    createdBy: number;
    isPublic: boolean;
}

export interface CreateEventDto {
    title: string;
    description?: string;
    date?: Date;
    createdBy: number;
    isPublic?: boolean;
}
//todo мб переделать с утилитарными классами

export interface UpdateEventDto {
    title?: string;
    description?: string;
    date?: Date;
    isPublic?: boolean;
}

export interface EventResponseDto {
    id: number;
    title: string;
    description?: string;
    date: Date;
    createdBy: UserResponseDto;
    isPublic: boolean;
    deletedAt?: Date | null;
}
