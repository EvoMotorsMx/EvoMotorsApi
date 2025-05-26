import mongoose, { Schema, Document } from "mongoose";
import { v4 as uuidV4 } from "uuid";
import {
  ProductSystemType,
  ProductType,
} from "../../../shared/enums/productModel";
import { ProductGroup } from "../../../core/domain/entities";

export interface ProductDocument extends Document {
  name: string;
  description?: string;
  sku?: string;
  type: ProductType;
  productGroupId?: ProductGroup; // FK → ProductGroup
  systemType?: ProductSystemType; // para anulaciones
  stock?: number; // solo si es producto físico
  price?: number;
  isComplement?: boolean; // indica si es un complemento
  complementId?: string | null; // FK → Product, puede ser nulo si no tiene complemento
}

const productSchema = new Schema<ProductDocument>(
  {
    _id: {
      type: String,
      default: () => uuidV4(),
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    sku: {
      type: String,
    },
    type: {
      type: String,
      enum: Object.values(ProductType),
      required: true,
    },
    productGroupId: {
      type: String,
      ref: "ProductGroup",
    },
    systemType: {
      type: String,
      enum: Object.values(ProductSystemType),
    },
    stock: {
      type: Number,
    },
    price: {
      type: Number,
    },
    isComplement: {
      type: Boolean,
      default: false,
    },
    complementId: {
      type: String,
      ref: "Product",
      default: null, // Permite que sea nulo si no tiene complemento
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

const Product = mongoose.model<ProductDocument>("Product", productSchema);

export default Product;
