import mongoose, { Schema, Document } from "mongoose";
import { v4 as uuidV4 } from "uuid";
import { EngineType, Transmission } from "../enums";

interface CarModelDocument extends Document {
  _id: string;
  name: string;
  brandId: string;
  year: string;
  engine: string;
  cylinder: string;
  combustion: string;
  transmission: Transmission;
  engineType: EngineType;
  productId: string[];
  fileId: string[];
}

const carModelSchema = new Schema<CarModelDocument>(
  {
    _id: {
      type: String,
      default: () => uuidV4(),
    },
    name: {
      type: String,
      required: true,
    },
    brandId: {
      type: String,
      required: true,
      ref: "Brand",
    },
    year: {
      type: String,
      required: true,
    },
    engine: {
      type: String,
      required: true,
    },
    cylinder: {
      type: String,
      required: true,
    },
    combustion: {
      type: String,
      required: true,
    },
    transmission: {
      type: String,
      required: true,
      enum: Object.values(Transmission),
    },
    engineType: {
      type: String,
      required: true,
      enum: Object.values(EngineType),
    },
    productId: [
      {
        type: String,
        ref: "Product",
      },
    ],
    fileId: [
      {
        type: String,
        ref: "File",
      },
    ],
  },
  {
    timestamps: true,
  },
);

const CarModel = mongoose.model<CarModelDocument>("CarModel", carModelSchema);

export default CarModel;
