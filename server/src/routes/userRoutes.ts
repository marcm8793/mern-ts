import express from "express";
import {
  getAllUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
} from "../controllers/userController";
import { authenticateToken } from "../middleware/auth";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management endpoints
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - first_name
 *         - last_name
 *         - age
 *         - phone_number
 *         - address
 *         - password
 *         - pass_id
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the user
 *         first_name:
 *           type: string
 *           description: The first name of the user
 *           example: John
 *         last_name:
 *           type: string
 *           description: The last name of the user
 *           example: Doe
 *         age:
 *           type: number
 *           description: The age of the user
 *           example: 30
 *         phone_number:
 *           type: string
 *           description: The phone number of the user
 *           example: 123-456-7890
 *         address:
 *           type: string
 *           description: The address of the user
 *           example: 123 Main St
 *         password:
 *           type: string
 *           description: The hashed password of the user
 *           example: hashedpassword123
 *         pass_id:
 *           type: string
 *           description: The ID of the associated pass
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved all users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       401:
 *         description: Token expired
 *       500:
 *         description: Internal server error
 */
router.get("/", authenticateToken, getAllUsers);

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Bad request
 *       401:
 *         description: Token expired
 *       500:
 *         description: Internal server error
 */
router.post("/", authenticateToken, createUser);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get a user by ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID
 *     responses:
 *       200:
 *         description: Successfully retrieved user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 *       401:
 *         description: Token expired
 *       500:
 *         description: Internal server error
 */
router.get("/:id", authenticateToken, getUser);

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Update a user by ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: Successfully updated user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 *       400:
 *         description: Bad request
 *       401:
 *         description: Token expired
 *       500:
 *         description: Internal server error
 */
router.put("/:id", authenticateToken, updateUser);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete a user by ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID
 *     responses:
 *       200:
 *         description: Successfully deleted user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: User not found
 *       401:
 *         description: Token expired
 *       500:
 *         description: Internal server error
 */
router.delete("/:id", authenticateToken, deleteUser);

export default router;
