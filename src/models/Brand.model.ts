import mongoose, { Schema, Document } from "mongoose";
import { v4 as uuidV4 } from "uuid";

interface BrandDocument extends Document {
  _id: string;
  name: string;
  description?: string;
}

const brandSchema = new Schema<BrandDocument>(
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
    description: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  },
);

const Brand = mongoose.model<BrandDocument>("Brand", brandSchema);

export default Brand;
