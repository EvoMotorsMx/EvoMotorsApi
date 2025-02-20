import mongoose, { Schema, Document } from "mongoose";
import { v4 as uuidV4 } from "uuid";
import {
  CarModel,
  Certificate,
  Customer,
  ErrorCode,
  File,
  Remission,
} from "../../../core/domain/entities";

export interface CarDocument extends Document {
  vin: string;
  plates: string;
  carModelId: CarModel;
  certificateId: Certificate;
  remissions: Remission[];
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
