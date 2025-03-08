import { Router } from 'express';
import UserController from '@controllers/UserController.js';

const router: Router = Router();

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
 *       - in: query
 *         name: hardDelete
 *         schema:
 *           type: boolean
 *         description: Hard delete user
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.delete('/:id', UserController.deleteUser);

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

/**
 * @swagger
 * /users/{id}/role:
 *   get:
 *     summary: Get the role of a user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the user whose role is being retrieved
 *     responses:
 *       200:
 *         description: Successfully retrieved user role
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 role:
 *                   type: string
 *                   example: "admin"
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.get('/:id/role', UserController.getUserRole);

/**
 * @swagger
 * /users/{id}/role:
 *   post:
 *     summary: Update the role of a user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the user whose role is being updated
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               newRole:
 *                 type: string
 *                 enum: [admin, user]
 *                 example: "admin"
 *     responses:
 *       200:
 *         description: Successfully updated user role
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User role updated successfully"
 *       400:
 *         description: Invalid role or user ID
 *       403:
 *         description: Unauthorized to change user role
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.post('/:id/role', UserController.setUserRole);

export default router;
