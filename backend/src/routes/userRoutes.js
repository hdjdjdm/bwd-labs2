import express from 'express';
import UserController from '../controllers/userController.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: API for /users
 */

/**
  * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: List of users
 *       500:
 *         description: Server error
 */
router.get('/', UserController.getAllUsers);

/**
  * @swagger
 * /users:
 *   post:
 *     summary: Create user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Maxim Morzyukov"
 *               email:
 *                 type: string
 *                 example: "krutoimax@example.com"
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Bad request (missing required fields)
 *       409:
 *         description: Conflict (email already exists)
 *       500:
 *         description: Server error
 */
router.post('/', UserController.createUser);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Soft delete an user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the user to delete
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.delete('/', UserController.deleteUser);

/**
 * @swagger
 * /users/{id}/restore:
 *   patch:
 *     summary: Restore a soft-deleted user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the user to restore
 *     responses:
 *       200:
 *         description: User restored successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.patch('/:id/restore', UserController.restoreUser);

export default router;