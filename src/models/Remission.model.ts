import mongoose, { Schema, Document } from "mongoose";
import { v4 as uuidV4 } from "uuid";

interface RemissionDocument extends Document {
  _id: string;
  remission: number;
  date: number;
  name: string;
  contact?: string;
  cellphone?: number;
  city?: string;
  brand?: string;
  modelo?: string;
  email?: string;
  socialNetwork?: string;
  rfc?: string;
  bill?: string;
  cfdiUse?: string;
  mileage?: number;
  year?: number;
  engine?: number;
  vim?: string;
}

const remissionSchema = new Schema<RemissionDocument>(
  {
    _id: {
      type: String,
      default: () => uuidV4(),
    },
    remission: {
      type: Number,
      required: true,
      unique: true,
    },
    date: {
      type: Number,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    contact: {
      type: String,
    },
    cellphone: {
      type: Number,
    },
    city: {
      type: String,
    },
    brand: {
      type: String,
    },
    modelo: {
      type: String,
    },
    email: {
      type: String,
    },
    socialNetwork: {
      type: String,
    },
    rfc: {
      type: String,
    },
    bill: {
      type: String,
    },
    cfdiUse: {
      type: String,
    },
    mileage: {
      type: Number,
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
  },
  {
    timestamps: true,
  },
);

remissionSchema.set("autoIndex", false);
remissionSchema.index({ name: 1 }, { unique: true });

const Remission = mongoose.model<RemissionDocument>("Remission", remissionSchema);

export default Remission;
