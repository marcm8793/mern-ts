import mongoose from "mongoose";
import app from "./app";
import { config } from "./config";

const startServer = async () => {
  if (!config.mongoURI) {
    console.error("MONGO_URI is not defined");
    process.exit(1);
  }

  try {
    await mongoose.connect(config.mongoURI, {
      authSource: "admin",
      dbName: "PassMgtDB-DEV",
    });

    app.listen(config.port, () => {
      console.log(`Server is running on port ${config.port}`);
    });
  } catch (error) {
    console.error("Error connecting to the database in server.ts", error);
    process.exit(1);
  }
};

startServer();
