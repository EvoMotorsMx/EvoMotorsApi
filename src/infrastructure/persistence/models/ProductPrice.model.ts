import mongoose, { Schema, Document } from "mongoose";
import { v4 as uuidV4 } from "uuid";
import { CarModel, Product } from "../../../core/domain/entities";

export interface ProductPriceDocument extends Document {
  carModelId: CarModel;
  productId: Product;
  price: number;
  hpIncrement: number;
  torqueIncrement: number;
}

const productPriceSchema = new Schema<ProductPriceDocument>(
  {
    _id: {
      type: String,
      default: () => uuidV4(),
    },
    carModelId: {
      type: String,
      required: true,
      ref: "CarModel",
    },
    productId: {
      type: String,
      required: true,
      ref: "Product",
    },
    price: {
      type: Number,
      required: true,
    },
    hpIncrement: {
      type: Number,
      required: true,
    },
    torqueIncrement: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const ProductPrice = mongoose.model<ProductPriceDocument>(
  "ProductPrice",
  productPriceSchema,
);

export default ProductPrice;
