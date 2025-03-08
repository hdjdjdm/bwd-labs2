import { Router } from 'express';
import eventsRouter from './eventRoutes.js';
import usersRouter from './userRoutes.js';
import authRouter from './authRoutes.js';
import jwtAuthMiddleware from '@middleware/jwtAuthMiddleware.js';
import { checkRole } from '@middleware/authMiddleware.js';
import { Roles } from '@constants/Roles.js';

const router: Router = Router();

router.use('/events', eventsRouter);
router.use('/users', jwtAuthMiddleware, checkRole(Roles.ADMIN), usersRouter);
router.use('/auth', authRouter);

export default router;
