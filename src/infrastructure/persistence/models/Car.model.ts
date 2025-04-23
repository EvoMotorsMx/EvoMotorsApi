import mongoose, { Schema, Document } from "mongoose";
import { v4 as uuidV4 } from "uuid";
import {
  CarModel,
  Certificate,
  Customer,
  File,
} from "../../../core/domain/entities";
import { TransmissionType } from "../../../shared/enums";

export interface CarDocument extends Document {
  vin: string;
  plates: string;
  carModelId: CarModel;
  customerId: Customer;
  certificateId: Certificate;
  year: number;
  transmissionType: TransmissionType;
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
    customerId: {
      type: String,
      ref: "Customer",
      required: true,
    },
    year: {
      type: Number,
      required: true,
      min: 1886,
      max: new Date().getFullYear() + 1,
    },
    transmissionType: {
      type: String,
      required: true,
      enum: Object.values(TransmissionType),
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
