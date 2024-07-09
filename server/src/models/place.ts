import { Schema, model, Document } from "mongoose";

export interface IPlace extends Document {
  address: string;
  phone_number: string;
  required_pass_level: number;
  required_age_level: number;
}

const placeSchema = new Schema<IPlace>({
  address: { type: String, required: true },
  phone_number: { type: String, required: true },
  required_pass_level: { type: Number, required: true, min: 1, max: 5 },
  required_age_level: { type: Number, required: true },
});

export const Place = model<IPlace>("Place", placeSchema);

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
 *         phone_number:
 *           type: string
 *           description: The phone number of the place
 *         required_pass_level:
 *           type: integer
 *           description: The required pass level to access the place
 *           minimum: 1
 *           maximum: 5
 *         required_age_level:
 *           type: integer
 *           description: The required age level to access the place
 *       example:
 *         _id: 60d0fe4f5311236168a109cb
 *         address: 123 Main St
 *         phone_number: 123-456-7890
 *         required_pass_level: 3
 *         required_age_level: 18
 */
