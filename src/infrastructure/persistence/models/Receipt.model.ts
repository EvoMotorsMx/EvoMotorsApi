import mongoose, { Schema, Document } from "mongoose";
import { v4 as uuidV4 } from "uuid";
import { isBase64 } from "validator";
import {
  ErrorCode,
  Witness,
  Car,
  ProductCompatibility,
  User,
} from "../../../core/domain/entities";

export interface ReceiptDocument extends Document {
  installationEndDate: Date;
  signImage: string;
  installationStatus: "pending" | "completed";
  tankStatus: number;
  mileage: number;
  damageImages: string[];
  damageStatusDescription?: string;
  scannerDescriptionImages: string[];
  scannerDescription?: string;
  //errorCodes: ErrorCode[]; implementar url autel
  carId: Car;
  witnesses: Witness[];
  productInstalled: ProductCompatibility[];
  cognitoId: string;
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
    signImage: {
      type: String,
      required: true,
      validate: {
        validator: function (value) {
          return isBase64(value);
        },
        message: (props) => `${props.value} is not a valid base64 string!`,
      },
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
    damageImages: [
      //base64 images
      {
        type: String,
        required: true,
        validate: {
          validator: function (value) {
            return isBase64(value);
          },
          message: (props) => `${props.value} is not a valid base64 string!`,
        },
      },
    ],
    damageStatusDescription: {
      type: String,
    },
    scannerDescriptionImages: [
      //url
      {
        type: String,
        required: true,
      },
    ],
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
  },
  {
    timestamps: true,
  },
);

const Receipt = mongoose.model<ReceiptDocument>("Receipt", receiptSchema);

export default Receipt;
