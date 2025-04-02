import { NextFunction, Request, Response } from 'express';
import AuthService from '@services/AuthService.js';
import CustomError from '@utils/CustomError.js';
import { ErrorCodes } from '@constants/Errors.js';
import { UniqueConstraintError } from 'sequelize';
import UserMapper from '@mappers/UserMapper.js';
import { CreateUserDto, LoginUserDto } from '@dto/UserDto.js';
import userMapper from '@mappers/UserMapper.js';

class AuthController {
    async registerUser(req: Request, res: Response, next: NextFunction) {
        try {
            const { email, password, name }: CreateUserDto = req.body;
            if (!name || !email || !password) {
                return next(new CustomError(ErrorCodes.BadRequest, 'Email, password and name are required.'));
            }

            if (name.trim() === '') {
                return next(new CustomError(ErrorCodes.BadRequest, 'Name must be a non-empty string'));
            }

            const trimmedName = name.trim();
            const trimmedPassword = String(password).trim();
            const trimmedEmail = email.trim();

            if (!AuthController.isValidEmail(trimmedEmail)) {
                return next(new CustomError(ErrorCodes.BadRequest, 'Invalid email format.'));
            }

            if (!AuthController.isValidPassword(trimmedPassword)) {
                return next(new CustomError(ErrorCodes.BadRequest, 'Password must be at least 6 characters long.'));
            }

            const { user, token } = await AuthService.registerUser({
                name: trimmedName,
                email: trimmedEmail,
                password: trimmedPassword,
            });

            res.status(201).json({
                message: 'User successfully registered',
                token: token,
                user: userMapper.toResponseDto(user),
            });
        } catch (e) {
            if (e instanceof UniqueConstraintError) {
                return next(new CustomError(ErrorCodes.ConflictError, 'Email already exists.'));
            }
            next(e);
        }
    }

    async loginUser(req: Request, res: Response, next: NextFunction) {
        try {
            const { email, password }: LoginUserDto = req.body;
            if (!email || !password) {
                return next(new CustomError(ErrorCodes.BadRequest, 'Email and password are required.'));
            }

            const trimmedEmail: string = email.trim();

            if (!AuthController.isValidEmail(trimmedEmail)) {
                return next(new CustomError(ErrorCodes.BadRequest, 'Invalid email format.'));
            }

            const { user, token } = await AuthService.loginUser(trimmedEmail, password);

            res.status(200).json({
                message: 'Login successfully',
                token,
                user: UserMapper.toResponseDto(user),
            });
        } catch (e) {
            next(e);
        }
    }

    private static isValidEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email.trim());
    };

    private static isValidPassword = (password: string): boolean => {
        const minLength = 6;
        return password.length >= minLength;
    };
}

export default new AuthController();
