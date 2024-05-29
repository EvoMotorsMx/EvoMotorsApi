import mongoose, { Schema, Document } from "mongoose";
import { v4 as uuidV4 } from "uuid";

interface CarDocument extends Document {
  _id: string;
  mileage: number;
  tankStatus: number;
  damageStatusDescription: string;
  damageImageUrl: string;
  scannerDescription: string;
  vin: string;
  plates: string;
  carModelId: string;
  witnessId: string[];
}

const carSchema = new Schema<CarDocument>(
  {
    _id: {
      type: String,
      default: () => uuidV4(),
    },
    mileage: {
      type: Number,
      required: true,
    },
    tankStatus: {
      type: Number,
      required: true,
    },
    damageStatusDescription: {
      type: String,
      required: true,
    },
    damageImageUrl: {
      type: String,
      required: true,
    },
    scannerDescription: {
      type: String,
      required: true,
    },
    vin: {
      type: String,
      required: true,
      unique: true,
    },
    plates: {
      type: String,
      required: true,
      unique: true,
    },
    carModelId: {
      type: String,
      required: true,
      ref: "CarModel",
    },
    witnessId: [
      {
        type: String,
        ref: "Witness",
      },
    ],
  },
  {
    timestamps: true,
  },
);

carSchema.set("autoIndex", false);
carSchema.index({ vin: 1, plates: 1 }, { unique: true });

const Car = mongoose.model<CarDocument>("Car", carSchema);

export default Car;
