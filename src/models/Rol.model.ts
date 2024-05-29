import mongoose, { Schema, Document } from "mongoose";
import { v4 as uuidV4 } from "uuid";

interface RoleDocument extends Document {
  _id: string;
  name: string;
}

const roleSchema = new Schema<RoleDocument>(
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
  },
  {
    timestamps: true,
  },
);

roleSchema.set("autoIndex", false);
roleSchema.index({ name: 1 }, { unique: true });

const Role = mongoose.model<RoleDocument>("Role", roleSchema);

export default Role;
