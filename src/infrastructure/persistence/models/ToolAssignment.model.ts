import mongoose, { Schema, Document } from "mongoose";
import { v4 as uuidV4 } from "uuid";
import { Tool } from "../../../core/domain/entities";

export interface ToolAssignmentDocument extends Document {
  initDate: Date;
  endDate: Date;
  assignedQuantity: number;
  tool: Tool;
  cognitoId: string;
}

const ToolAssignmentSchema = new Schema<ToolAssignmentDocument>(
  {
    _id: {
      type: String,
      default: () => uuidV4(),
    },
    initDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    assignedQuantity: {
      type: Number,
      required: true,
    },
    tool: {
      type: String,
      required: true,
      ref: "CarModel",
    },
    cognitoId: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const ToolAssignment = mongoose.model<ToolAssignmentDocument>(
  "ToolAssignment",
  ToolAssignmentSchema,
);

export default ToolAssignment;
