import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { User } from "../models/user";
import { Pass } from "../models/pass";
import { generateToken } from "../middleware/auth";

export const register = async (req: Request, res: Response) => {
  try {
    const {
      first_name,
      last_name,
      age,
      phone_number,
      address,
      password,
      pass_level,
    } = req.body;

    if (
      !first_name ||
      !last_name ||
      !age ||
      !phone_number ||
      !address ||
      !password ||
      !pass_level
    ) {
      return res.status(400).json({ error: "All fields are required" });
    }

    if (pass_level < 1 || pass_level > 5) {
      return res
        .status(400)
        .json({ error: "pass_level must be between 1 and 5" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const pass = new Pass({
      level: pass_level,
      created_At: new Date(),
    });

    await pass.save();

    const user = new User({
      first_name,
      last_name,
      age,
      phone_number,
      address,
      password: hashedPassword,
      pass_id: pass._id,
    });

    await user.save();

    const token = generateToken(user);

    res.status(201).json({
      user: {
        _id: user._id,
        first_name: user.first_name,
        last_name: user.last_name,
        age: user.age,
        phone_number: user.phone_number,
        address: user.address,
        pass_id: user.pass_id,
      },
      token,
    });
  } catch (error) {
    console.error("Error in register:", error);
    res.status(400).json({ error: (error as Error).message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { first_name, last_name, password } = req.body;

    if (!first_name || !last_name || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const user = await User.findOne({ first_name, last_name });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(400).json({ error: "Invalid password" });
    }

    const token = generateToken(user);

    res.status(200).json({ token });
  } catch (error) {
    console.error("Error in login:", error);
    res.status(500).json({ error: (error as Error).message });
  }
};

export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Error in getCurrentUser:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
