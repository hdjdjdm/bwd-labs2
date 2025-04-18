import { Roles } from '@constants/Roles.js';

export interface UserDto {
    id: number;
    name: string;
    email: string;
    password: string;
    role: Roles;
}

export interface CreateUserDto {
    name: string;
    email: string;
    password: string;
    role?: Roles;
}

export interface LoginUserDto {
    email: string;
    password: string;
}

export interface UserResponseDto {
    id: number;
    name: string;
    email: string;
    role: Roles;
}

export interface ChangeUserRoleDto {
    role: Roles;
}
