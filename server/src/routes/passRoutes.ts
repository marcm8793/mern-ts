import express from "express";
import {
  getAllPasses,
  createPass,
  getPass,
  updatePass,
  deletePass,
  getUserPasses,
} from "../controllers/passController";
import { authenticateToken } from "../middleware/auth";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Passes
 *   description: API for managing passes
 */

/**
 * @swagger
 * /passes:
 *   get:
 *     summary: Retrieve a list of passes
 *     tags: [Passes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of passes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Pass'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get("/", authenticateToken, getAllPasses);

/**
 * @swagger
 * /passes:
 *   post:
 *     summary: Create a new pass
 *     tags: [Passes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - level
 *             properties:
 *               userId:
 *                 type: string
 *                 description: The ID of the user
 *               level:
 *                 type: integer
 *                 description: The level of the pass
 *                 minimum: 1
 *                 maximum: 5
 *             example:
 *               userId: "60d0fe4f5311236168a109cc"
 *               level: 3
 *     responses:
 *       201:
 *         description: Pass created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Pass'
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */
router.post("/", authenticateToken, createPass);

/**
 * @swagger
 * /passes/user:
 *   get:
 *     summary: Get the pass for the current user
 *     tags: [Passes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: The pass of the current user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Pass'
 *       400:
 *         description: User ID is required
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User or pass not found
 */
router.get("/user", authenticateToken, getUserPasses);

/**
 * @swagger
 * /passes/{id}:
 *   get:
 *     summary: Get a pass by ID
 *     tags: [Passes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The pass ID
 *     responses:
 *       200:
 *         description: The pass data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Pass'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Pass not found
 */
router.get("/:id", authenticateToken, getPass);

/**
 * @swagger
 * /passes/{id}:
 *   put:
 *     summary: Update a pass by ID
 *     tags: [Passes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The pass ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - level
 *             properties:
 *               level:
 *                 type: integer
 *                 description: The level of the pass
 *                 minimum: 1
 *                 maximum: 5
 *             example:
 *               level: 3
 *     responses:
 *       200:
 *         description: Pass updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Pass'
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Pass not found
 */
router.put("/:id", authenticateToken, updatePass);

/**
 * @swagger
 * /passes/{id}:
 *   delete:
 *     summary: Delete a pass by ID
 *     tags: [Passes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The pass ID
 *     responses:
 *       200:
 *         description: Pass deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Pass not found
 */
router.delete("/:id", authenticateToken, deletePass);

export default router;
