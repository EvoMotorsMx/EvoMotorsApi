import mongoose from "mongoose";

let databaseConnection: any = null;
const databaseURL = process.env.DATABASE_URL;

export const connectToDatabase = async () => {
  if (!databaseURL) {
    throw new Error("The database connection string is not defined");
  }

  if (databaseConnection == null) {
    databaseConnection = mongoose
      .connect(databaseURL, {
        serverSelectionTimeoutMS: 5000,
      })
      .then(() => mongoose);

    await databaseConnection;
  }

  return databaseConnection;
};
