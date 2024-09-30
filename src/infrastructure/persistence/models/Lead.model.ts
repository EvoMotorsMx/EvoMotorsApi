import mongoose, { Schema, Document } from "mongoose";
import { v4 as uuidV4 } from "uuid";
import { Car, Company, Remission } from "../../../core/domain/entities";

export interface LeadDocument extends Document {
  name: string;
  lastName: string;
  status: string;
  city: string;
  state: string;
  country: string;
  phone: string;
  email: string;
  remissions: Remission[];
  rfc: string;
  cfdi: string;
  razon_social: string;
  factura: string;
  contact: string;
  company: Company;
  cars: Car[];
}

const leadSchema = new Schema<LeadDocument>(
  {
    _id: {
      type: String,
      default: () => uuidV4(),
    },
    name: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    rfc: {
      type: String,
      required: true,
    },
    cfdi: {
      type: String,
      required: true,
    },
    razon_social: {
      type: String,
      required: true,
    },
    factura: {
      type: String,
      required: true,
    },
    remissions: [
      {
        type: String,
        ref: "Remission",
      },
    ],
  },
  {
    timestamps: true,
  },
);

leadSchema.set("autoIndex", false);

const Lead = mongoose.model<LeadDocument>("Lead", leadSchema);

export default Lead;
