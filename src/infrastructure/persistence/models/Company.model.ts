import mongoose, { Schema, Document } from "mongoose";
import { v4 as uuidV4 } from "uuid";

export interface CompanyDocument extends Document {
  name: string;
  city: string;
  state: string;
  country: string;
  phone: string;
  email: string;
  users: string[];
}

const companySchema: Schema<CompanyDocument> = new Schema<CompanyDocument>(
  {
    _id: {
      type: String,
      default: () => uuidV4(),
    },
    name: {
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
    phone: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    users: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  },
);

const Company = mongoose.model<CompanyDocument>("Company", companySchema);

export default Company;
