import { Request, Response } from "express";
import { User } from "../models/user";
import { TokenExpiredError } from "jsonwebtoken";

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find().select("-password").populate("pass_id");
    res.status(200).json(users);
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      return res.status(401).json({ error: "Token expired" });
    }
    res.status(500).json({ error: (error as Error).message });
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const user = new User(req.body);
    await user.save();
    const userData = await User.findById(user._id)
      .select("-password")
      .populate("pass_id");
    res.status(201).json(userData);
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      return res.status(401).json({ error: "Token expired" });
    }
    res.status(400).json({ error: (error as Error).message });
  }
};

export const getUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id)
      .select("-password")
      .populate("pass_id");
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      return res.status(401).json({ error: "Token expired" });
    }
    res.status(500).json({ error: (error as Error).message });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    })
      .select("-password")
      .populate("pass_id");
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      return res.status(401).json({ error: "Token expired" });
    }
    res.status(400).json({ error: (error as Error).message });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id).select(
      "-password"
    );
    if (user) {
      res.status(200).json({ message: "User deleted" });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      return res.status(401).json({ error: "Token expired" });
    }
    res.status(500).json({ error: (error as Error).message });
  }
};
