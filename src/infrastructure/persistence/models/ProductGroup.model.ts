import mongoose, { Schema, Document } from "mongoose";
import { v4 as uuidV4 } from "uuid";

export interface ProductGroupDocument extends Document {
  name: string;
  productBrandId: string; // FK → ProductBrand
  description?: string;
  image?: string;
}

const productSchema = new Schema<ProductGroupDocument>(
  {
    _id: {
      type: String,
      default: () => uuidV4(),
    },
    name: {
      type: String,
      required: true,
    },
    productBrandId: {
      type: String,
      ref: "ProductBrand",
      required: true,
    },
    description: {
      type: String,
    },
    image: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

productSchema.pre("save", function (next) {
  if (this.name) {
    this.name = this.name.toUpperCase().trim();
  }
  next();
});

const ProductGroup = mongoose.model<ProductGroupDocument>(
  "ProductGroup",
  productSchema,
);

export default ProductGroup;
