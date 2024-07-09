import { Request, Response } from "express";
import { Pass } from "../models/pass";
import { User } from "../models/user";
import { TokenExpiredError } from "jsonwebtoken";
import { Schema } from "mongoose";

export const getAllPasses = async (req: Request, res: Response) => {
  try {
    const passes = await Pass.find();
    if (passes.length === 0) {
      return res.status(404).json({ error: "No passes found" });
    }

    res.status(200).json(passes);
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      return res.status(401).json({ error: "Token expired" });
    }
    res.status(500).json({ error: (error as Error).message });
  }
};

export const createPass = async (req: Request, res: Response) => {
  try {
    const { userId, level } = req.body;

    if (!userId || !level) {
      return res.status(400).json({ error: "userId and level are required" });
    }

    if (level < 1 || level > 5) {
      return res.status(400).json({ error: "Level must be between 1 and 5" });
    }

    const existingUser = await User.findById(userId);
    if (!existingUser) {
      return res.status(404).json({ error: "User not found" });
    }

    const pass = new Pass({ level });
    await pass.save();

    existingUser.pass_id = pass._id as Schema.Types.ObjectId;
    await existingUser.save();

    res.status(201).json(pass);
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      return res.status(401).json({ error: "Token expired" });
    }
    res.status(400).json({ error: (error as Error).message });
  }
};

export const getPass = async (req: Request, res: Response) => {
  try {
    const pass = await Pass.findById(req.params.id);
    if (pass) {
      res.status(200).json(pass);
    } else {
      res.status(404).json({ error: "Pass not found" });
    }
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      return res.status(401).json({ error: "Token expired" });
    }
    res.status(500).json({ error: (error as Error).message });
  }
};

export const updatePass = async (req: Request, res: Response) => {
  try {
    if (req.body.level < 1 || req.body.level > 5) {
      return res.status(400).json({ error: "Level must be between 1 and 5" });
    }

    const pass = await Pass.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (pass) {
      res.status(200).json(pass);
    } else {
      res.status(404).json({ error: "Pass not found" });
    }
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      return res.status(401).json({ error: "Token expired" });
    }
    res.status(400).json({ error: (error as Error).message });
  }
};

export const deletePass = async (req: Request, res: Response) => {
  try {
    const pass = await Pass.findByIdAndDelete(req.params.id);

    if (pass) {
      await User.updateMany({ pass_id: pass._id }, { $unset: { pass_id: 1 } });
      res.status(200).json({ message: "Pass deleted" });
    } else {
      res.status(404).json({ error: "Pass not found" });
    }
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      return res.status(401).json({ error: "Token expired" });
    }
    res.status(500).json({ error: (error as Error).message });
  }
};

export const getUserPasses = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const user = await User.findById(userId)
      .populate("pass_id")
      .select("-password");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!user.pass_id) {
      return res.status(404).json({ error: "User has no pass" });
    }

    console.log("User pass:", user.pass_id);
    res.status(200).json(user.pass_id);
  } catch (error) {
    console.error("Error in getUserPasses:", error);
    res.status(500).json({ error: (error as Error).message });
  }
};
