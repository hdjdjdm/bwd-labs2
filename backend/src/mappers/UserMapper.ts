import User from '@models/User.js';
import { UserResponseDto } from '@dto/UserDto.js';
import EventMapper from '@mappers/EventMapper.js';

class UserMapper {
    static toResponseDto(user: User): UserResponseDto {
        return {
            id: user.id,
            username: user.username,
            firstName: user.firstName,
            middleName: user.middleName,
            lastName: user.lastName,
            gender: user.gender,
            dateOfBirth: user.dateOfBirth,
            email: user.email,
            role: user.role,
            events: user.events ? user.events.map((event) => EventMapper.toResponseDto(event)) : [],
        };
    }
}

export default UserMapper;
