import mongoose, { Schema, Document } from "mongoose";
import { v4 as uuidV4 } from "uuid";
import { FileType } from "../../../shared/enums";
import { CarModel } from "../../../core/domain/entities";

export interface FileDocument extends Document {
  fileUrl: string;
  type: FileType;
  carModelId: CarModel | string;
}

const fileSchema = new Schema<FileDocument>(
  {
    _id: {
      type: String,
      default: () => uuidV4(),
    },
    fileUrl: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: Object.values(FileType),
    },
    carModelId: {
      type: String,
      required: true,
      ref: "CarModel",
    },
  },
  {
    timestamps: true,
  },
);

const File = mongoose.model<FileDocument>("File", fileSchema);

export default File;
