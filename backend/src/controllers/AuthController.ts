import { NextFunction, Request, Response } from 'express';
import AuthService from '@services/AuthService.js';
import CustomError from '@utils/CustomError.js';
import { ErrorCodes } from '@constants/Errors.js';
import { UniqueConstraintError } from 'sequelize';
import UserMapper from '@mappers/UserMapper.js';
import userMapper from '@mappers/UserMapper.js';
import { LoginInput, loginSchema, RegisterInput, registerSchema } from '@validation/user.js';

class AuthController {
    async registerUser(req: Request, res: Response, next: NextFunction) {
        try {
            const data: RegisterInput = registerSchema.parse(req.body);

            const { user, token } = await AuthService.registerUser(data);

            res.status(201).json({
                message: 'Пользователь успешно зарегистрирован',
                token: token,
                user: userMapper.toResponseDto(user),
            });
        } catch (e) {
            if (e instanceof UniqueConstraintError) {
                return next(new CustomError(ErrorCodes.ConflictError, 'Электронная почта уже существует.'));
            }
            next(e);
        }
    }

    async loginUser(req: Request, res: Response, next: NextFunction) {
        try {
            const data: LoginInput = loginSchema.parse(req.body);

            const { user, token } = await AuthService.loginUser(data);

            res.status(200).json({
                message: 'Login successfully',
                token,
                user: UserMapper.toResponseDto(user),
            });
        } catch (e) {
            next(e);
        }
    }
}

export default new AuthController();
