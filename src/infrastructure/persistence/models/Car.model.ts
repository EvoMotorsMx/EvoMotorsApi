import mongoose, { Schema, Document } from "mongoose";
import { v4 as uuidV4 } from "uuid";
import {
  CarModel,
  Certificate,
  ErrorCode,
  Remission,
  Witness,
} from "../../../core/domain/entities";

export interface CarDocument extends Document {
  mileage: number;
  tankStatus: number;
  damageImageUrl: string;
  damageStatusDescription: string;
  scannerDescription: string;
  vin: string;
  plates: string;
  leadId: string;
  carModelId: CarModel;
  certificateId: Certificate;
  remissions: Remission[];
  witnesses: Witness[];
  errorCodes: ErrorCode[];
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
    remissions: [
      {
        type: String,
        ref: "Remission",
      },
    ],
    leadId: {
      type: String,
      ref: "Lead",
    },
    errorCodes: [
      {
        type: String,
        ref: "ErrorCode",
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
