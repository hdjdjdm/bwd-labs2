const express = require('express');
const EventController = require('../controllers/eventController');
const router = express.Router();

router.post('/', EventController.createEvent);

router.get('/', EventController.getAllEvents);

router.get('/:id', EventController.getEvent);

router.put('/:id', EventController.updateEvent);

router.delete('/:id', EventController.deleteEvent);

router.patch('/:id/restore', EventController.restoreEvent);

module.exports = router;