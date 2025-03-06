import { Router } from 'express';
import EventController from '@controllers/EventController';
import jwtAuthMiddleware from '@middleware/jwtAuthMiddleware';

const router: Router = Router();

/**
 * @swagger
 * tags:
 *   name: Events
 *   description: API for managing events
 */

/**
 * @swagger
 * /events:
 *   get:
 *     summary: Get all events
 *     tags: [Events]
 *     parameters:
 *       - in: query
 *         name: withDeleted
 *         schema:
 *           type: boolean
 *         description: Include soft-deleted events
 *       - in: query
 *         name: hardDelete
 *         schema:
 *           type: boolean
 *         description: Hard delete event
 *     responses:
 *       200:
 *         description: List of events
 *       500:
 *         description: Internal server error
 */
router.get('/', EventController.getAllEvents);

/**
 * @swagger
 * /events:
 *   post:
 *     summary: Create a new event
 *     tags: [Events]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Watanagashi Festival"
 *               createdBy:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Event created successfully
 *       400:
 *         description: Missing required fields
 *       500:
 *         description: Internal server error
 */
router.post('/', jwtAuthMiddleware, EventController.createEvent);

/**
 * @swagger
 * /events/{id}:
 *   get:
 *     summary: Get an event by ID
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the event
 *     responses:
 *       200:
 *         description: Event details
 *       404:
 *         description: Event not found
 *       500:
 *         description: Internal server error
 */
router.get('/:id', jwtAuthMiddleware, EventController.getEvent);

/**
 * @swagger
 * /events/{id}:
 *   put:
 *     summary: Update an event
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the event to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Updated Event Name"
 *     responses:
 *       200:
 *         description: Event updated successfully
 *       400:
 *         description: No data for update
 *       404:
 *         description: Event not found
 *       500:
 *         description: Internal server error
 */
router.put('/:id', jwtAuthMiddleware, EventController.updateEvent);

/**
 * @swagger
 * /events/{id}:
 *   delete:
 *     summary: Soft delete an event
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the event to delete
 *     responses:
 *       200:
 *         description: Event deleted successfully
 *       404:
 *         description: Event not found
 *       500:
 *         description: Internal server error
 */
router.delete('/:id', jwtAuthMiddleware, EventController.deleteEvent);

/**
 * @swagger
 * /events/{id}/restore:
 *   patch:
 *     summary: Restore a soft-deleted event
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the event to restore
 *     responses:
 *       200:
 *         description: Event restored successfully
 *       404:
 *         description: Event not found
 *       500:
 *         description: Internal server error
 */
router.patch('/:id/restore', jwtAuthMiddleware, EventController.restoreEvent);

export default router;
