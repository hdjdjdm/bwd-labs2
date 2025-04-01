import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import config from '@config/config.js';
import User from '@models/User.js';
import UserDTO from '@dto/UserDTO.js';
import CustomError from '@utils/CustomError.js';
import { ErrorCodes } from '@constants/Errors.js';

class AuthService {
    async registerUser(data: Pick<UserDTO, 'name' | 'email' | 'password'>): Promise<{ user: User; token: string }> {
        const user = await User.create({
            name: data.name,
            email: data.email,
            password: data.password,
        });

        const token = AuthService.generateToken(user);
        return { user, token };
    }

    async loginUser(email: string, password: string): Promise<{ user: User; token: string }> {
        const user = await User.findOne({
            where: { email },
        });

        if (!user) {
            throw new CustomError(ErrorCodes.BadRequest, 'User with this email does not exist.');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new CustomError(ErrorCodes.BadRequest, 'Invalid password.');
        }

        const token = AuthService.generateToken(user);
        return { user, token };
    }

    private static generateToken(user: User): string {
        const jwtSecret = config.auth.jwtSecret;
        if (!jwtSecret) {
            throw new Error('Missing jwt secret');
        }

        const jwtExpiresIn = config.auth.jwtExpiresIn;

        if (!jwtExpiresIn) {
            throw new Error('Missing jwt expiration time');
        }

        return jwt.sign({ id: user.id }, jwtSecret, {
            expiresIn: jwtExpiresIn,
        } as jwt.SignOptions);
    }
}

export default new AuthService();
