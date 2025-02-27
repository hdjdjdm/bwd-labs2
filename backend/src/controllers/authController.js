import AuthService from "../services/authService.js";
import { ValidError } from "../utils/errors.js";

class AuthController {
    static async registerUser(req, res, next) {
        try {
            let { name, email, password } = req.body; 
    
            if (!name || !email || !password) {
                throw new ValidError('Email, password and name are required.');
            }

            if (typeof name !== 'string' || name.trim() === '') {
                throw new ValidError('Name must be a non-empty string');
            }
            name = name.trim();

            password = String(password).trim();

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                throw new ValidError('Invalid email format.');
            }
            email = email.trim();
    
            const user = await AuthService.registerUser({ name, email, password });
            return res.status(201).json({ message: 'User successfully registered', user });
        } catch (e) {
            next(e);
        }
    }

    static async loginUser(req, res, next) {
        try {
            let { email, password } = req.body;

            if (!email || !password) {
                throw new ValidError('Email and password are required.');
            }

            password = String(password).trim();

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                throw new ValidError('Invalid email format.');
            }
            email = email.trim();

            const token = await AuthService.loginUser(email, password);

            return res.status(200).json({ message: 'Login successfully', token })
        } catch (e) {
            next(e);
        }
    }
}

export default AuthController;