import mongoose, { Schema, Document } from "mongoose";
import { v4 as uuidV4 } from "uuid";

export interface ProductBrandDocument extends Document {
  name: string;
  logo?: string;
  description?: string;
}

const productBrandSchema = new Schema<ProductBrandDocument>(
  {
    _id: {
      type: String,
      default: () => uuidV4(),
    },
    name: {
      type: String,
      required: true,
    },
    logo: {
      type: String,
    },
    description: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

productBrandSchema.pre("save", function (next) {
  if (this.name) {
    this.name = this.name.toUpperCase().trim();
  }
  next();
});

const ProductBrand = mongoose.model<ProductBrandDocument>(
  "ProductBrand",
  productBrandSchema,
);

export default ProductBrand;
