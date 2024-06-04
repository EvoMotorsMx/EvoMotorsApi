import mongoose, { Schema, Document } from "mongoose";
import { v4 as uuidV4 } from "uuid";

interface CertificateDocument extends Document {
  _id: string;
  name: string;
  date: number;
  folio: number;
  brand: string;
  modelo?: string;
  year?: number;
  engine?: number;
  vim?: string;
  mileage?: number;
}

const certificateSchema = new Schema<CertificateDocument>(
  {
    _id: {
      type: String,
      default: () => uuidV4(),
    },
    name: {
      type: String,
      required: true,
      unique: true,
    },
    date: {
      type: Number,
      required: true,
    },
    folio: {
      type: Number,
      required: true,
      unique: true,
    },
    brand: {
      type: String,
      required: true,
      unique: true,
    },
    modelo: {
      type: String,
    },
    year: {
      type: Number,
    },
    engine: {
      type: Number,
    },
    vim: {
      type: String,
    },
    mileage: {
      type: Number,
    },
  },
  {
    timestamps: true,
  },
);

certificateSchema.set("autoIndex", false);
certificateSchema.index({ name: 1 }, { unique: true });

const Certificate = mongoose.model<CertificateDocument>("Certificate", certificateSchema);

export default Certificate;
