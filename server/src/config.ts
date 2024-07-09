import dotenv from "dotenv";

dotenv.config();

export const config = {
  port: 8080,
  accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
  mongoURI:
    process.env.MONGO_URI ||
    "mongodb://root:pass123@host.docker.internal:27017/DBPass",
  mongoURITest:
    process.env.MONGO_URI_test ||
    "mongodb://root:pass123@host.docker.internal:27018/DBPass",
};
