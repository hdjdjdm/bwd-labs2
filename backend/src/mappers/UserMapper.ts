import User from '@models/User.js';
import { UserResponseDto } from '@dto/UserDto.js';

class UserMapper {
    static toResponseDto(user: User): UserResponseDto {
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
        };
    }
}

export default UserMapper;
