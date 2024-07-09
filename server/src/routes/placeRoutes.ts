import express from "express";
import {
  getAllPlaces,
  createPlace,
  getPlace,
  updatePlace,
  deletePlace,
  checkUserAccess,
  getAccessiblePlaces,
} from "../controllers/placeController";
import { authenticateToken } from "../middleware/auth";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Places
 *   description: Places endpoints
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Place:
 *       type: object
 *       required:
 *         - address
 *         - phone_number
 *         - required_pass_level
 *         - required_age_level
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the place
 *         address:
 *           type: string
 *           description: The address of the place
 *           example: "123 rue des Palmiers, Nice, France"
 *         phone_number:
 *           type: string
 *           description: The contact phone number of the place
 *           example: "+33 6 12 34 56 78"
 *         required_pass_level:
 *           type: integer
 *           description: The required pass level to access the place
 *           minimum: 1
 *           maximum: 5
 *           example: 3
 *         required_age_level:
 *           type: integer
 *           description: The required age level to access the place
 *           example: 18
 */

/**
 * @swagger
 * /places:
 *   get:
 *     summary: Get all places
 *     tags: [Places]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved all places
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Place'
 *       404:
 *         description: No places found
 *       401:
 *         description: Unauthorized - Token expired
 *       500:
 *         description: Internal server error
 */
router.get("/", authenticateToken, getAllPlaces);

/**
 * @swagger
 * /places:
 *   post:
 *     summary: Create a new place
 *     tags: [Places]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Place'
 *     responses:
 *       201:
 *         description: Place created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Place'
 *       400:
 *         description: Bad request - Invalid data provided
 *       401:
 *         description: Unauthorized - Token expired
 *       500:
 *         description: Internal server error
 */
router.post("/", authenticateToken, createPlace);

/**
 * @swagger
 * /places/{id}:
 *   get:
 *     summary: Get a place by ID
 *     tags: [Places]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Place ID
 *     responses:
 *       200:
 *         description: Successfully retrieved place
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Place'
 *       404:
 *         description: Place not found
 *       401:
 *         description: Unauthorized - Token expired
 *       500:
 *         description: Internal server error
 */
router.get("/:id", authenticateToken, getPlace);

/**
 * @swagger
 * /places/{id}:
 *   put:
 *     summary: Update a place by ID
 *     tags: [Places]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Place ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Place'
 *     responses:
 *       200:
 *         description: Successfully updated place
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Place'
 *       404:
 *         description: Place not found
 *       400:
 *         description: Bad request - Invalid data provided
 *       401:
 *         description: Unauthorized - Token expired
 *       500:
 *         description: Internal server error
 */
router.put("/:id", authenticateToken, updatePlace);

/**
 * @swagger
 * /places/{id}:
 *   delete:
 *     summary: Delete a place by ID
 *     tags: [Places]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Place ID
 *     responses:
 *       200:
 *         description: Successfully deleted place
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: Place not found
 *       401:
 *         description: Unauthorized - Token expired
 *       500:
 *         description: Internal server error
 */
router.delete("/:id", authenticateToken, deletePlace);

/**
 * @swagger
 * /places/access/{userId}/{placeId}:
 *   get:
 *     summary: Check user access to a place
 *     tags: [Places]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID
 *       - in: path
 *         name: placeId
 *         schema:
 *           type: string
 *         required: true
 *         description: Place ID
 *     responses:
 *       200:
 *         description: Access check result
 *       404:
 *         description: User or Place not found
 *       403:
 *         description: Access denied
 *       401:
 *         description: Unauthorized - Token expired
 *       500:
 *         description: Internal server error
 */
router.get("/access/:userId/:placeId", authenticateToken, checkUserAccess);

/**
 * @swagger
 * /places/accessible/{userId}:
 *   get:
 *     summary: Get accessible places for a user
 *     tags: [Places]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID
 *     responses:
 *       200:
 *         description: Successfully retrieved accessible places
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Place'
 *       404:
 *         description: User not found
 *       403:
 *         description: No pass found
 *       401:
 *         description: Unauthorized - Token expired
 *       500:
 *         description: Internal server error
 */
router.get("/accessible/:userId", authenticateToken, getAccessiblePlaces);

export default router;
