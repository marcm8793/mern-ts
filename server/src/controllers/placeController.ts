import { Request, Response } from "express";
import { Place } from "../models/place";
import { User } from "../models/user";
import { Pass } from "../models/pass";
import { TokenExpiredError } from "jsonwebtoken";

export const getAllPlaces = async (req: Request, res: Response) => {
  try {
    const places = await Place.find();
    if (places.length === 0) {
      return res.status(404).json({ error: "No places found" });
    }
    res.status(200).json(places);
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      return res.status(401).json({ error: "Token expired" });
    }
    res.status(500).json({ error: (error as Error).message });
  }
};

export const createPlace = async (req: Request, res: Response) => {
  try {
    const { address, phone_number, required_pass_level, required_age_level } =
      req.body;

    if (
      !address ||
      !phone_number ||
      !required_pass_level ||
      !required_age_level
    ) {
      return res.status(400).json({
        error:
          "address, phone_number, required_pass_level, and required_age_level are required",
      });
    }

    if (required_pass_level < 1 || required_pass_level > 5) {
      return res
        .status(400)
        .json({ error: "Pass level must be between 1 and 5" });
    }

    const place = new Place({
      address,
      phone_number,
      required_pass_level,
      required_age_level,
    });

    await place.save();
    res.status(201).json(place);
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      return res.status(401).json({ error: "Token expired" });
    }
    res.status(400).json({ error: (error as Error).message });
  }
};

export const getPlace = async (req: Request, res: Response) => {
  try {
    const place = await Place.findById(req.params.id);
    if (!place) {
      return res.status(404).json({ error: "Place not found" });
    }
    res.status(200).json(place);
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      return res.status(401).json({ error: "Token expired" });
    }
    res.status(500).json({ error: (error as Error).message });
  }
};

export const updatePlace = async (req: Request, res: Response) => {
  try {
    const { address, phone_number, required_pass_level, required_age_level } =
      req.body;

    if (
      required_pass_level &&
      (required_pass_level < 1 || required_pass_level > 5)
    ) {
      return res
        .status(400)
        .json({ error: "Pass level must be between 1 and 5" });
    }

    const updatedPlace = await Place.findByIdAndUpdate(
      req.params.id,
      { address, phone_number, required_pass_level, required_age_level },
      { new: true }
    );

    if (!updatedPlace) {
      return res.status(404).json({ error: "Place not found" });
    }

    res.status(200).json(updatedPlace);
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      return res.status(401).json({ error: "Token expired" });
    }
    res.status(400).json({ error: (error as Error).message });
  }
};

export const deletePlace = async (req: Request, res: Response) => {
  try {
    const deletedPlace = await Place.findByIdAndDelete(req.params.id);
    if (!deletedPlace) {
      return res.status(404).json({ error: "Place not found" });
    }
    res.status(200).json({ message: "Place deleted" });
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      return res.status(401).json({ error: "Token expired" });
    }
    res.status(500).json({ error: (error as Error).message });
  }
};

export const checkUserAccess = async (req: Request, res: Response) => {
  try {
    const { userId, placeId } = req.params;

    const user = await User.findById(userId).select("-password");
    const place = await Place.findById(placeId);

    if (!user || !place) {
      return res.status(404).json({ error: "User or Place not found" });
    }

    const pass = await Pass.findOne(user.pass_id);

    if (!pass) {
      return res.status(403).json({ error: "Access denied" });
    }

    if (
      pass.level >= place.required_pass_level &&
      user.age >= place.required_age_level
    ) {
      return res.status(200).json({ access: true });
    }

    res.status(403).json({ access: false });
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      return res.status(401).json({ error: "Token expired" });
    }
    res.status(500).json({ error: (error as Error).message });
  }
};

export const getAccessiblePlaces = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const pass = await Pass.findOne(user.pass_id);

    if (!pass) {
      return res.status(403).json({ error: "No pass found" });
    }

    const places = await Place.find({
      required_pass_level: { $lte: pass.level },
      required_age_level: { $lte: user.age },
    });

    res.status(200).json(places);
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      return res.status(401).json({ error: "Token expired" });
    }
    res.status(500).json({ error: (error as Error).message });
  }
};
