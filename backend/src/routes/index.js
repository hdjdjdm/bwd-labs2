const express = require('express');
const eventsRouter = require('./eventRoutes');
const usersRouter = require('./userRoutes');

const router = express.Router();

router.use('/events', eventsRouter);
router.use('/users', usersRouter);

module.exports = router;