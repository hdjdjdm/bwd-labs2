import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import config from '@config/config.js';
import User from '@models/User.js';
import CustomError from '@utils/CustomError.js';
import { ErrorCodes } from '@constants/Errors.js';
import { LoginInput, RegisterInput } from '@validation/user.js';

class AuthService {
    async registerUser(data: RegisterInput): Promise<{ user: User; token: string }> {
        const user = await User.create({
            email: data.email,
            password: data.password,
            username: data.username,
            firstName: data.firstName ?? '',
            middleName: data.middleName ?? '',
            lastName: data.lastName ?? '',
            gender: data.gender,
            dateOfBirth: new Date(data.dateOfBirth),
        });

        const token = AuthService.generateToken(user);
        return { user, token };
    }

    async loginUser(data: LoginInput): Promise<{ user: User; token: string }> {
        const user = await User.findOne({
            where: { email: data.email },
        });

        if (!user) {
            throw new CustomError(ErrorCodes.BadRequest, 'Пользователя с этой почтой не существует.');
        }

        const isPasswordValid = await bcrypt.compare(data.password, user.password);
        if (!isPasswordValid) {
            throw new CustomError(ErrorCodes.BadRequest, 'Неверный пароль.');
        }

        const token = AuthService.generateToken(user);
        return { user, token };
    }

    private static generateToken(user: User): string {
        const jwtSecret = config.auth.jwtSecret;
        if (!jwtSecret) {
            throw new Error('Отсутствует JWT Secret');
        }

        const jwtExpiresIn = config.auth.jwtExpiresIn;

        if (!jwtExpiresIn) {
            throw new Error('Отсутствует время истечения срока действия JWT');
        }

        return jwt.sign({ id: user.id }, jwtSecret, {
            expiresIn: jwtExpiresIn,
        } as jwt.SignOptions);
    }
}

export default new AuthService();
