import User from '@models/User.js';
import { UserResponseDto } from '@dto/UserDto.js';
import EventMapper from '@mappers/EventMapper.js';

class UserMapper {
    static toResponseDto(user: User): UserResponseDto {
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            events: user.events ? user.events.map((event) => EventMapper.toResponseDto(event)) : [],
        };
    }
}

export default UserMapper;
