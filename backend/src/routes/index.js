import express from 'express';
import eventsRouter from './eventRoutes.js';
import usersRouter from './userRoutes.js';
import authRouter from './authRoutes.js';

const router = express.Router();

router.use('/events', eventsRouter);
router.use('/users', usersRouter);
router.use('/auth', authRouter);

export default router;