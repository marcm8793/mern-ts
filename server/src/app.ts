import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

import userRoutes from "./routes/userRoutes";
import passRoutes from "./routes/passRoutes";
import placeRoutes from "./routes/placeRoutes";
import authRoutes from "./routes/authRoutes";

import setupSwagger from "./swagger";
import { authenticateToken } from "./middleware/auth";

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.use("/api/auth", authRoutes);

app.use("/api/users", authenticateToken, userRoutes);
app.use("/api/passes", authenticateToken, passRoutes);
app.use("/api/places", authenticateToken, placeRoutes);

app.get("/", (req, res) => {
  res.send("Connected to the server");
});

setupSwagger(app);

export default app;
