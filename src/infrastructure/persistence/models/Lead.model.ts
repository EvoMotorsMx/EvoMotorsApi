import mongoose, { Schema, Document } from "mongoose";
import { v4 as uuidV4 } from "uuid";
import { Car, Remission } from "../../../core/domain/entities";

export interface LeadDocument extends Document {
  name: string;
  lastName: string;
  city: string;
  state: string;
  country: string;
  status: string;
  phone: string;
  email: string;
  rfc: string;
  cfdi: string;
  razon_social: string;
  factura: string;
  remissions: Remission[];
  cars: Car[];
  company: string;
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
