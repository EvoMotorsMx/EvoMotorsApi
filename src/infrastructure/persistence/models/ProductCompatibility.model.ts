import mongoose, { Schema, Document } from "mongoose";
import { v4 as uuidV4 } from "uuid";
import { CarModel, Product } from "../../../core/domain/entities";

export interface ProductCompatibilityDocument extends Document {
  product: Product;
  carModel: CarModel;
}

const ProductCompatibilitySchema = new Schema<ProductCompatibilityDocument>(
  {
    _id: {
      type: String,
      default: () => uuidV4(),
    },
    product: {
      type: String,
      required: true,
      ref: "Product",
      unique: true,
    },
    carModel: {
      type: String,
      required: true,
      ref: "CarModel",
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
