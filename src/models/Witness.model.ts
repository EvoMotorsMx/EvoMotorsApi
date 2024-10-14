import mongoose, { Schema, Document } from "mongoose";
import { v4 as uuidV4 } from "uuid";

interface WitnessDocument extends Document {
  _id: string;
  name: string;
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
  },
  {
    timestamps: true,
  },
);

witnessSchema.set("autoIndex", false);
witnessSchema.index({ name: 1 }, { unique: true });

const Witness = mongoose.model<WitnessDocument>("Witness", witnessSchema);

export default Witness;
