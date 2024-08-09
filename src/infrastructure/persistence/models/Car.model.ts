import mongoose, { Schema, Document } from "mongoose";
import { v4 as uuidV4 } from "uuid";
import {
  Brand,
  CarModel,
  Certificate,
  Remission,
  Witness,
} from "../../../core/domain/entities";

export interface CarDocument extends Document {
  mileage: number;
  tankStatus: number;
  damageStatusDescription: string;
  damageImageUrl: string;
  scannerDescription: string;
  vin: string;
  plates: string;
  carModelId: CarModel;
  witnesses: Witness[];
  certificateId: Certificate;
  remissionId: Remission;
  leadId: string;
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
    damageImageUrl: {
      type: String,
      required: true,
    },
    damageStatusDescription: {
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
    witnesses: [
      {
        type: String,
        ref: "Witness",
      },
    ],
    certificateId: {
      type: String,
      ref: "Certificate",
    },
    remissionId: [
      {
        type: String,
        ref: "Remission",
      },
    ],
    leadId: {
      type: String,
      ref: "Lead",
    },
  },
  {
    timestamps: true,
  },
);

carSchema.set("autoIndex", false);
carSchema.index({ vin: 1, plates: 1 }, { unique: true });

const Car = mongoose.model<CarDocument>("Car", carSchema);

export default Car;
