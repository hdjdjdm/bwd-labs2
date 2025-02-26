import express from 'express';
import eventsRouter from './eventRoutes.js';
import usersRouter from './userRoutes.js'

const router = express.Router();

router.use('/events', eventsRouter);
router.use('/users', usersRouter);

export default router;