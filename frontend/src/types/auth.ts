import UserDto from '@dtos/UserDto.ts';

export interface LoginResponse {
    token: string;
    user: UserDto;
    message: string;
}

export type LoginRequest = Pick<UserDto, 'email'> & { password: string };

export interface RegisterResponse {
    status: number;
    message: string;
}

export type RegisterRequest = Pick<
    UserDto,
    | 'email'
    | 'username'
    | 'firstName'
    | 'middleName'
    | 'lastName'
    | 'gender'
    | 'dateOfBirth'
> & { password: string };
