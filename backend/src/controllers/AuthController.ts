import { NextFunction, Request, Response } from 'express';
import AuthService from '@services/AuthService.js';
import UserDTO from '@dto/UserDTO.js';
import CustomError from '@utils/CustomError.js';
import { ErrorCodes } from '@constants/Errors.js';
import { UniqueConstraintError } from 'sequelize';

class AuthController {
    async registerUser(req: Request, res: Response, next: NextFunction) {
        try {
            const { name, email, password }: Pick<UserDTO, 'name' | 'email' | 'password'> = req.body;

            if (!name || !email || !password) {
                return next(new CustomError(ErrorCodes.BadRequest, 'Email, password and name are required.'));
            }

            if (name.trim() === '') {
                return next(new CustomError(ErrorCodes.BadRequest, 'Name must be a non-empty string'));
            }

            const trimmedName = name.trim();
            const trimmedPassword = String(password).trim();
            const trimmedEmail = email.trim();

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(trimmedEmail)) {
                return next(new CustomError(ErrorCodes.BadRequest, 'Invalid email format.'));
            }

            const { user, token } = await AuthService.registerUser({
                name: trimmedName,
                email: trimmedEmail,
                password: trimmedPassword,
            });

            res.status(201).json({
                //todo pick??
                message: 'User successfully registered',
                token: token,
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
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
            const { email, password }: Pick<UserDTO, 'email' | 'password'> = req.body;

            if (!email || !password) {
                return next(new CustomError(ErrorCodes.BadRequest, 'Email and password are required.'));
            }

            const trimmedEmail: string = email.trim();

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(trimmedEmail)) {
                return next(new CustomError(ErrorCodes.BadRequest, 'Invalid email format.'));
            }

            const token = await AuthService.loginUser(trimmedEmail, password);

            res.status(200).json({
                message: 'Login successfully',
                token,
            });
        } catch (e) {
            next(e);
        }
    }
}

export default new AuthController();
