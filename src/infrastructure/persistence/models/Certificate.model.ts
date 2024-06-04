import mongoose, { Schema, Document } from "mongoose";
import { v4 as uuidV4 } from "uuid";

export interface CertificateDocument extends Document {
  name: string;
  //_id: string;
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
    name: {
      type: String,
      required: true,
      unique: true,
    },
    /*_id: {
      type: String,
      default: () => uuidV4(),
    },*/
    date: {
      type: Number,
    },
    folio: {
      type: Number,
    },
    brand: {
      type: String,
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

/*certificateSchema.pre("save", function (next) {
  if (this.name) {
    this.name = this.name.toUpperCase();
  }
  next();
});*/

const Certificate = mongoose.model<CertificateDocument>("Certificate", certificateSchema);

export default Certificate;