import 'dotenv/config';
import { Sequelize } from 'sequelize';
import models from '../models/index.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { ServerError, ValidError } from '../utils/errors.js';
const { User } = models;

class AuthService {
    static async registerUser(data) {
        try {
            const user = await User.create(data);
            return user;
        } catch (e) {
            if (e instanceof Sequelize.UniqueConstraintError) {
                throw new ValidError('Email already exists. Please use a different email.')
            }
            throw new ServerError('Error creating user: ' + e.message);
        }
    }

    static async loginUser(email, password) {
        const user = await User.findOne({ where: { email } });

        if (!user) {
            throw new ValidError('User with this email does not exist.');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new ValidError('Invalid password.');
        }

        const token = jwt.sign(
            { id: user.id, email: user.email, name: user.name },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        return token;
    }
}

export default AuthService;