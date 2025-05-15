import mongoose, { Schema, Document } from "mongoose";
import { v4 as uuidV4 } from "uuid";
import { isBase64 } from "validator";
import {
  Witness,
  Car,
  ProductCompatibility,
} from "../../../core/domain/entities";

export interface SignatureData {
  s3Url: string;
  timestamp: Date;
  hash: string;
}

export interface ReceiptDocument extends Document {
  installationEndDate: Date;
  installationStatus: "pending" | "completed";
  tankStatus: number;
  mileage: number;
  damageImage: SignatureData;
  damageStatusDescription?: string;
  scannerDescriptionImages: string;
  scannerDescription?: string;
  //errorCodes: ErrorCode[]; implementar url autel
  carId: Car;
  witnesses: Witness[];
  productInstalled: ProductCompatibility[];
  cognitoId: string;
  signatureData: SignatureData;
  createdAt: Date;
  updatedAt: Date;
}

const receiptSchema = new Schema<ReceiptDocument>(
  {
    _id: {
      type: String,
      default: () => uuidV4(),
    },
    installationEndDate: {
      type: Date,
    },
    installationStatus: {
      type: String,
      required: true,
      enum: ["pending", "completed"],
    },
    tankStatus: {
      type: Number,
      required: true,
      validate: {
        validator: function (value) {
          return value >= 0 && value <= 100;
        },
        message: (props) => `${props.value} is not a valid tank status!`,
      },
    },
    mileage: {
      type: Number,
      required: true,
      validate: {
        validator: function (value) {
          return value >= 0;
        },
        message: (props) => `${props.value} is not a valid mileage!`,
      },
    },
    damageImage: {
      s3Url: { type: String, required: true },
      timestamp: { type: Date, required: true },
      hash: { type: String, required: true },
    },
    damageStatusDescription: {
      type: String,
    },
    scannerDescriptionImages:
      //url
      {
        type: String,
        required: true,
      },

    scannerDescription: {
      type: String,
    },
    carId: {
      type: String,
      required: true,
      ref: "Car",
    },
    cognitoId: {
      type: String,
      required: true,
    },
    witnesses: [
      {
        type: String,
        ref: "Witness",
      },
    ],
    productInstalled: [
      {
        type: String,
        ref: "ProductCompatibility",
      },
    ],
    signatureData: {
      s3Url: { type: String, required: true },
      timestamp: { type: Date, required: true },
      hash: { type: String, required: true },
    },
  },
  {
    timestamps: true,
  },
);

const Receipt = mongoose.model<ReceiptDocument>("Receipt", receiptSchema);

export default Receipt;
