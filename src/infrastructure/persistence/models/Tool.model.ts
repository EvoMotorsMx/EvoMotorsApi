import mongoose, { Schema, Document } from "mongoose";
import { v4 as uuidV4 } from "uuid";

export interface ToolDocument extends Document {
  name: string;
  description?: string;
  totalQuantity: number;
  availableQuantity: number;
}

const ToolSchema = new Schema<ToolDocument>(
  {
    _id: {
      type: String,
      default: () => uuidV4(),
    },
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
    },
    totalQuantity: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

ToolSchema.pre("save", function (next) {
  if (this.name) {
    this.name = this.name.toUpperCase();
  }
  next();
});

const Tool = mongoose.model<ToolDocument>("Tool", ToolSchema);

export default Tool;
