import mongoose, { Schema, Document } from "mongoose";
import { v4 as uuidV4 } from "uuid";
import {
  CarModel,
  Certificate,
  Customer,
  File,
} from "../../../core/domain/entities";

export interface CarDocument extends Document {
  vin: string;
  plates: string;
  carModelId: CarModel;
  customerId: Customer;
  certificateId: Certificate;
  oriFile?: File;
  modFile?: File;
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
    customerId: {
      type: String,
      ref: "Customer",
      required: true,
    },
    oriFile: {
      type: String,
      ref: "File",
    },
    modFile: {
      type: String,
      ref: "File",
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
