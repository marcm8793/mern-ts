import express from "express";
import { register, login, getCurrentUser } from "../controllers/authController";
import { authenticateToken } from "../middleware/auth";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication routes
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - first_name
 *               - last_name
 *               - age
 *               - phone_number
 *               - address
 *               - password
 *               - pass_level
 *             properties:
 *               first_name:
 *                 type: string
 *                 description: First name of the user
 *               last_name:
 *                 type: string
 *                 description: Last name of the user
 *               age:
 *                 type: integer
 *                 description: Age of the user
 *               phone_number:
 *                 type: string
 *                 description: Phone number of the user
 *               address:
 *                 type: string
 *                 description: Address of the user
 *               password:
 *                 type: string
 *                 description: Password of the user
 *               pass_level:
 *                 type: integer
 *                 description: Pass level of the user
 *                 minimum: 1
 *                 maximum: 5
 *             example:
 *               first_name: John
 *               last_name: Doe
 *               age: 30
 *               phone_number: "1234567890"
 *               address: "123 Main St"
 *               password: "password123"
 *               pass_level: 3
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Bad request
 */
router.post("/register", register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - first_name
 *               - last_name
 *               - password
 *             properties:
 *               first_name:
 *                 type: string
 *                 description: First name of the user
 *               last_name:
 *                 type: string
 *                 description: Last name of the user
 *               password:
 *                 type: string
 *                 description: Password of the user
 *             example:
 *               first_name: John
 *               last_name: Doe
 *               password: "password123"
 *     responses:
 *       200:
 *         description: User logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT token
 *       400:
 *         description: Bad request
 *       404:
 *         description: User not found
 */
router.post("/login", login);

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Get the current authenticated user
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: The authenticated user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: User ID is required
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */
router.get("/me", authenticateToken, getCurrentUser);

export default router;
