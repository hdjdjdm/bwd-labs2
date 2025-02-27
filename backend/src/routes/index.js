import express from 'express';
import eventsRouter from './eventRoutes.js';
import usersRouter from './userRoutes.js';
import authRouter from './authRoutes.js';
import jwtAuthMiddleware from '../middleware/jwtAuthMiddleware.js';
import { checkLevelAccess } from '../middleware/authMiddleware.js';
import ROLES from '../constants/roles.js';

const router = express.Router();

router.use('/events', eventsRouter);
router.use('/users', jwtAuthMiddleware, checkLevelAccess(ROLES.ADMIN), usersRouter);
router.use('/auth', authRouter);

export default router;