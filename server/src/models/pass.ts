import { Schema, model, Document } from "mongoose";

export interface IPass extends Document {
  level: number;
  created_At: Date;
  updated_At?: Date;
}

const passSchema = new Schema<IPass>({
  level: { type: Number, required: true, min: 1, max: 5 },
  created_At: { type: Date, default: Date.now },
  updated_At: { type: Date },
});

export const Pass = model<IPass>("Pass", passSchema);

/**
 * @swagger
 * components:
 *   schemas:
 *     Pass:
 *       type: object
 *       required:
 *         - level
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the pass
 *         level:
 *           type: integer
 *           description: The level of the pass
 *           minimum: 1
 *           maximum: 5
 *         created_At:
 *           type: string
 *           format: date-time
 *           description: The date when the pass was created
 *         updated_At:
 *           type: string
 *           format: date-time
 *           description: The date when the pass was last updated
 *       example:
 *         _id: 60d0fe4f5311236168a109ca
 *         level: 3
 *         created_At: 2024-06-25T10:34:02.491Z
 *         updated_At: 2024-06-25T10:34:02.491Z
 */
