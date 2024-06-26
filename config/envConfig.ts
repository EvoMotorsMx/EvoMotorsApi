import * as dotenv from "dotenv";
import path = require("path");

dotenv.config({ path: path.resolve(__dirname, "../.env") });

export type ConfigProps = {
  MONGO_NAME: string;
  MONGO_PROFILE: string;
  MONGO_REGION: string;
  MONGO_PROJECT: string;
  MONGO_ORG: string;
  MONGO_IP: string;
  DB_USERNAME: string;
  DB_PASSWORD: string;
  DB_NAME: string;
};

export const getConfig = (): ConfigProps => ({
  MONGO_NAME: process.env.MONGO_NAME || "",
  MONGO_PROFILE: process.env.MONGO_PROFILE || "",
  MONGO_REGION: process.env.MONGO_REGION || "",
  MONGO_PROJECT: process.env.MONGO_PROJECT || "",
  MONGO_ORG: process.env.MONGO_ORG || "",
  MONGO_IP: process.env.MONGO_IP || "",
  DB_USERNAME: process.env.DB_USERNAME || "",
  DB_PASSWORD: process.env.DB_PASSWORD || "",
  DB_NAME: process.env.DB_NAME || "",
});
