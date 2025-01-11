import mongoose, { Schema, Document } from "mongoose";
import { v4 as uuidV4 } from "uuid";
import { CarModel, Tool } from "../../../core/domain/entities";

export interface ToolCompatibilityDocument extends Document {
  tool: Tool;
  carModel: CarModel;
}

const ToolCompatibilitySchema = new Schema<ToolCompatibilityDocument>(
  {
    _id: {
      type: String,
      default: () => uuidV4(),
    },
    tool: {
      type: String,
      required: true,
      ref: "Tool",
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

const ToolCompatibility = mongoose.model<ToolCompatibilityDocument>(
  "ToolCompatibility",
  ToolCompatibilitySchema,
);

export default ToolCompatibility;
