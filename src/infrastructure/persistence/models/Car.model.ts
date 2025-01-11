import mongoose, { Schema, Document } from "mongoose";
import { v4 as uuidV4 } from "uuid";
import {
  CarModel,
  Certificate,
  Customer,
  ErrorCode,
  File,
  Remission,
  Witness,
} from "../../../core/domain/entities";

export interface CarDocument extends Document {
  mileage: number;
  tankStatus: number;
  damageImageUrl: string[];
  damageStatusDescription: string;
  scannerDescriptionUrl: string[];
  scannerDescription: string;
  vin: string;
  plates: string;
  carModelId: CarModel;
  certificateId: Certificate;
  remissions: Remission[];
  witnesses: Witness[];
  customerId: Customer;
  errorCodes: ErrorCode[];
  files: File[];
}

const carSchema = new Schema<CarDocument>(
  {
    _id: {
      type: String,
      default: () => uuidV4(),
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
    mileage: {
      type: Number,
      required: true,
    },
    tankStatus: {
      type: Number,
      required: true,
    },
    damageImageUrl: [
      {
        type: String,
      },
    ],
    damageStatusDescription: {
      type: String,
      required: true,
    },
    scannerDescriptionUrl: [
      {
        type: String,
        required: true,
      },
    ],
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
    customerId: {
      type: String,
      ref: "Customer",
      required: true,
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
