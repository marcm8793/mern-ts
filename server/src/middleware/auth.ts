import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { IUser } from "../models/user";
import { config } from "../config";

interface JwtPayload {
  id: string;
  exp: number;
}

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, config.accessTokenSecret as string, (err, user) => {
    if (err) return res.sendStatus(403);

    const decoded = user as JwtPayload;

    if (decoded.exp * 1000 < Date.now()) {
      return res.status(401).json({ message: "Token expired" });
    }

    req.user = decoded;
    next();
  });
};

export const generateToken = (user: IUser) => {
  return jwt.sign({ id: user._id }, config.accessTokenSecret as string, {
    expiresIn: "30m",
  });
};
