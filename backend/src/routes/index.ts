import { Router } from 'express';
import eventsRouter from './eventRoutes';
import usersRouter from './userRoutes';
import authRouter from './authRoutes';
import jwtAuthMiddleware from '@middleware/jwtAuthMiddleware';
import { checkRole } from '@middleware/authMiddleware';
import { Roles } from '@constants/Roles';

const router: Router = Router();

router.use('/events', eventsRouter);
router.use('/users', jwtAuthMiddleware, checkRole(Roles.ADMIN), usersRouter);
router.use('/auth', authRouter);

export default router;
