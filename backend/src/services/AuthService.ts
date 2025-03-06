import Sequelize from 'sequelize';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { ServerError, ValidError } from '@utils/errors';
import config from '@config/config';
import User from '@models/User';

interface RegisterUserData {
    name: string;
    email: string;
    password: string;
}

class AuthService {
    static async registerUser(data: RegisterUserData): Promise<{ user: User; token: string }> {
        try {
            const user = await User.create({
                name: data.name,
                email: data.email,
                password: data.password,
            });

            const token = AuthService.generateToken(user);
            return { user, token };
        } catch (e: unknown) {
            if (e instanceof Sequelize.UniqueConstraintError) {
                throw new ValidError('Email already exists. Please use a different email.');
            }
            if (e instanceof Error) {
                throw new ServerError('Error creating user: ' + e.message);
            }
            throw new ServerError('An unknown error occurred while creating the user.');
        }
    }

    static async loginUser(email: string, password: string): Promise<string> {
        const user = await User.findOne({
            where: { email },
        });

        if (!user) {
            throw new ValidError('User with this email does not exist.');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new ValidError('Invalid password.');
        }

        return AuthService.generateToken(user);
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

export default AuthService;
