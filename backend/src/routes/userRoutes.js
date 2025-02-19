const express = require('express');
const UserController = require('../controllers/userController');
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

module.exports = router;
