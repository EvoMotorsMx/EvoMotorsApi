import mongoose, { Schema, Document } from "mongoose";
import { v4 as uuidV4 } from "uuid";

export interface PlatformDocument extends Document {
  name: string;
  description?: string;
}

const platformSchema = new Schema<PlatformDocument>(
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
  },
  {
    timestamps: true,
  },
);

const Platform = mongoose.model<PlatformDocument>("Platform", platformSchema);

export default Platform;
