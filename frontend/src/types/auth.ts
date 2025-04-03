import UserDto from '@dtos/UserDto.ts';

export interface LoginResponse {
    token: string;
    user: UserDto;
    message: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterResponse {
    status: number;
    message: string;
}
