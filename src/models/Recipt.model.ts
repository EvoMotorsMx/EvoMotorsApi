import mongoose, { Schema, Document } from "mongoose";
import { v4 as uuidV4 } from "uuid";

interface ReceiptDocument extends Document {
  _id: string;
  userId: string;
  productId: string[];
  installationTime: Date;
  reviewVehicleStart: number;
  reviewVehicleResponse: number;
  reviewFunctionality: number;
  reviewService: number;
  reviewTime: number;
  reviewRecommendation: number;
  discount: string;
  date: Date;
  finalPrice: number;
  arriveTime: Date;
}

const receiptSchema = new Schema<ReceiptDocument>(
  {
    _id: {
      type: String,
      default: () => uuidV4(),
    },
    userId: {
      type: String,
      required: true,
      ref: "User",
    },
    productId: [
      {
        type: String,
        required: true,
        ref: "Product",
      },
    ],
    installationTime: {
      type: Date,
      required: true,
    },
    reviewVehicleStart: {
      type: Number,
      required: false,
      min: 1,
      max: 5,
    },
    reviewVehicleResponse: {
      type: Number,
      required: false,
      min: 1,
      max: 5,
    },
    reviewFunctionality: {
      type: Number,
      required: false,
      min: 1,
      max: 5,
    },
    reviewService: {
      type: Number,
      required: false,
      min: 1,
      max: 5,
    },
    reviewTime: {
      type: Number,
      required: false,
      min: 1,
      max: 5,
    },
    reviewRecommendation: {
      type: Number,
      required: false,
      min: 1,
      max: 5,
    },
    discount: {
      type: String,
      required: false,
    },
    date: {
      type: Date,
      required: true,
    },
    finalPrice: {
      type: Number,
      required: true,
    },
    arriveTime: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const Receipt = mongoose.model<ReceiptDocument>("Receipt", receiptSchema);

export default Receipt;
