import { Request, Response, NextFunction } from 'express';
import AuthService from '../services/AuthService';
import { ValidError } from '../utils/errors';

interface RegisterRequest extends Request {
    body: {
        name: string;
        email: string;
        password: string;
    };
}

interface LoginRequest extends Request {
    body: {
        email: string;
        password: string;
    };
}

class AuthController {
    static async registerUser(req: RegisterRequest, res: Response, next: NextFunction) {
        try {
            const { name, email, password } = req.body;

            if (!name || !email || !password) {
                throw new ValidError('Email, password and name are required.');
            }

            if (name.trim() === '') {
                //todo Попробовать прокинуть число.
                throw new ValidError('Name must be a non-empty string');
            }

            const trimmedName = name.trim();
            const trimmedPassword = String(password).trim();
            const trimmedEmail = email.trim();

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(trimmedEmail)) {
                throw new ValidError('Invalid email format.');
            }

            const { user, token } = await AuthService.registerUser({
                name: trimmedName,
                email: trimmedEmail,
                password: trimmedPassword,
            });

            res.status(201).json({
                message: 'User successfully registered',
                token: token,
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
            });
        } catch (e) {
            next(e);
        }
    }

    static async loginUser(req: LoginRequest, res: Response, next: NextFunction) {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                throw new ValidError('Email and password are required.');
            }

            const trimmedPassword: string = password.trim();
            const trimmedEmail: string = email.trim();

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(trimmedEmail)) {
                throw new ValidError('Invalid email format.');
            }

            const token = await AuthService.loginUser(trimmedEmail, trimmedPassword);

            res.status(200).json({
                message: 'Login successfully',
                token,
            });
        } catch (e) {
            next(e);
        }
    }
}

export default AuthController;
