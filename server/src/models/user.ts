import { Schema, model, Document } from "mongoose";

export interface IUser extends Document {
  first_name: string;
  last_name: string;
  age: number;
  phone_number: string;
  address: string;
  password: string;
  pass_id: Schema.Types.ObjectId;
}

const userSchema = new Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  age: { type: Number, required: true },
  phone_number: { type: String, required: true },
  address: { type: String, required: true },
  password: { type: String, required: true },
  pass_id: { type: Schema.Types.ObjectId, ref: "Pass", required: true },
});

export const User = model<IUser>("User", userSchema);

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
 *       properties:
 *         first_name:
 *           type: string
 *           description: The first name of the user
 *           example: John
 *         last_name:
 *           type: string
 *           description: The last name of the user
 *           example: Doe
 *         age:
 *           type: integer
 *           description: The age of the user
 *           example: 30
 *         phone_number:
 *           type: string
 *           description: The contact phone number of the user
 *           example: +33 6 12 34 56 78
 *         address:
 *           type: string
 *           description: The address of the user
 *           example: 456 rue des Lilas, Paris, France
 *         password:
 *           type: string
 *           description: The password for the user's account
 *           example: Password123
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
 *         last_name:
 *           type: string
 *           description: The last name of the user
 *         age:
 *           type: integer
 *           description: The age of the user
 *         phone_number:
 *           type: string
 *           description: The phone number of the user
 *         address:
 *           type: string
 *           description: The address of the user
 *         password:
 *           type: string
 *           description: The password of the user (hashed)
 *         pass_id:
 *           type: string
 *           description: The ID of the associated pass
 *       example:
 *         _id: 60d0fe4f5311236168a109cc
 *         first_name: John
 *         last_name: Doe
 *         age: 30
 *         phone_number: 123-456-7890
 *         address: 123 Main St
 *         password: hashedpassword123
 *         pass_id: 60d0fe4f5311236168a109ca
 */
