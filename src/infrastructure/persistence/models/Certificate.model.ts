import mongoose, { Schema, Document } from "mongoose";
import { v4 as uuidV4 } from "uuid";

export interface CertificateDocument extends Document {
  name: string;
  date: number;
  carId: string;
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
    carId: {
      type: String,
      required: true,
      ref: "Car",
    },
  },
  {
    timestamps: true,
  },
);

const Certificate = mongoose.model<CertificateDocument>(
  "Certificate",
  certificateSchema,
);

export default Certificate;
