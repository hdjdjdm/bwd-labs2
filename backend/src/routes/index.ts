import { Router } from 'express';
import eventsRouter from './eventRoutes.js';
import usersRouter from './userRoutes.js';
import authRouter from './authRoutes.js';
import jwtAuthMiddleware from '@middleware/jwtAuthMiddleware.js';

const router: Router = Router();

router.use('/events', eventsRouter);
router.use('/users', jwtAuthMiddleware, usersRouter);
router.use('/auth', authRouter);

export default router;
