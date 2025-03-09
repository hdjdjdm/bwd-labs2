import { Request, Response } from 'express';
import AuthService from '@services/AuthService.js';
import { ValidError } from '@utils/errors.js';
import UserDTO from '@dto/UserDTO.js';

class AuthController {
    async registerUser(req: Request, res: Response) {
        const { name, email, password }: UserDTO = req.body;

        if (!name || !email || !password) {
            throw new ValidError('Email, password and name are required.');
        }

        if (name.trim() === '') {
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
    }

    async loginUser(req: Request, res: Response) {
        const { email, password }: UserDTO = req.body;

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
    }
}

export default new AuthController();
