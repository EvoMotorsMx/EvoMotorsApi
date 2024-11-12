import mongoose, { Schema, Document } from "mongoose";
import { v4 as uuidV4 } from "uuid";
import { Brand } from "../../../core/domain/entities";

export interface ErrorCodeDocument extends Document {
  code: string;
  name: string;
  brand: Brand;
  description?: string;
}

const errorCodeSchema = new Schema<ErrorCodeDocument>(
  {
    _id: {
      type: String,
      default: () => uuidV4(),
    },
    code: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
      unique: true,
    },
    brand: {
      type: String,
      required: true,
      ref: "Brand",
    },
    description: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

errorCodeSchema.pre("save", function (next) {
  if (this.name) {
    this.name = this.name.toUpperCase();
  }
  if (this.code) {
    this.code = this.code.toUpperCase();
  }
  next();
});

const ErrorCode = mongoose.model<ErrorCodeDocument>(
  "ErrorCode",
  errorCodeSchema,
);

export default ErrorCode;
