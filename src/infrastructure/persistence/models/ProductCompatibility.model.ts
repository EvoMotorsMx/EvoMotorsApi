import mongoose, { Schema, Document } from "mongoose";
import { v4 as uuidV4 } from "uuid";
import { CarModel, Product } from "../../../core/domain/entities";

export interface ProductCompatibilityDocument extends Document {
  productId: Product; // FK → Product
  carModelId: CarModel; // FK → CarModel
  endHp?: number; // Optional field for end horsepower
  endTorque?: number;
  vMax?: string;
  priceOverride?: number;
  priceAdditional?: number;
  notes?: string;
  description?: string;
  complementId?: Product; // FK → Product
}

const ProductCompatibilitySchema = new Schema<ProductCompatibilityDocument>(
  {
    _id: {
      type: String,
      default: () => uuidV4(),
    },
    productId: {
      type: String,
      required: true,
      ref: "Product",
    },
    carModelId: {
      type: String,
      required: true,
      ref: "CarModel",
    },
    endHp: {
      type: Number,
      required: false,
    },
    endTorque: {
      type: Number,
      required: false,
    },
    vMax: {
      type: String,
      required: false,
    },
    priceOverride: {
      type: Number,
      required: false,
    },
    priceAdditional: {
      type: Number,
      required: false,
    },
    notes: {
      type: String,
      required: false,
    },
    description: {
      type: String,
      required: false,
    },
    complementId: {
      type: String,
      required: false,
      ref: "Product",
    },
  },
  {
    timestamps: true,
  },
);

const ProductCompatibility = mongoose.model<ProductCompatibilityDocument>(
  "ProductCompatibility",
  ProductCompatibilitySchema,
);

export default ProductCompatibility;
