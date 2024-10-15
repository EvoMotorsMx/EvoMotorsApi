import mongoose, { Schema, Document } from "mongoose";
import { v4 as uuidV4 } from "uuid";

export interface WitnessDocument extends Document {
  name: string;
  description?: string;
}

const witnessSchema = new Schema<WitnessDocument>(
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
  },
  {
    timestamps: true,
  },
);

witnessSchema.pre("save", function (next) {
  if (this.name) {
    this.name = this.name.toUpperCase();
  }
  next();
});

const Witness = mongoose.model<WitnessDocument>("Witness", witnessSchema);

export default Witness;