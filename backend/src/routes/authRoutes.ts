import { Router } from 'express';
import AuthController from '@controllers/AuthController.js';

const router: Router = Router();

router.post('/register', AuthController.registerUser);

router.post('/login', AuthController.loginUser);

export default router;
