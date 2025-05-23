import mongoose, { Schema, Document } from "mongoose";
import { v4 as uuidV4 } from "uuid";
import { CombustionType, EngineType } from "../../../shared/enums";
import {
  File,
  Brand,
  ToolCompatibility,
  ProductCompatibility,
} from "../../../core/domain/entities";

export interface CarModelDocument extends Document {
  name: string;
  brandId: Brand;
  year: string[];
  engineSize: string;
  cylinder: number;
  combustion: CombustionType;
  engineType: EngineType;
  originalHp: number;
  originalTorque: number;
  topSpeed: number;
  files?: File[];
  products?: ProductCompatibility[];
  toolCompatibility?: ToolCompatibility[];
  isActive?: boolean;
}

const carModelSchema: Schema<CarModelDocument> = new Schema<CarModelDocument>(
  {
    _id: {
      type: String,
      default: () => uuidV4(),
    },
    name: {
      type: String,
      required: true,
    },
    brandId: {
      type: String,
      required: true,
      ref: "Brand",
    },
    year: [
      {
        type: String,
        required: true,
        validate: {
          validator: function (v: string) {
            const yearNum = parseInt(v, 10);
            return (
              /^\d{4}$/.test(v) &&
              yearNum >= 1886 &&
              yearNum <= new Date().getFullYear()
            );
          },
          message: (props: { value: string }) =>
            `${props.value} is not a valid year! Year must be a four-digit number between 1886 and the current year.`,
        },
      },
    ],
    engineSize: {
      type: String,
      required: true,
    },
    cylinder: {
      type: Number,
      required: true,
    },
    combustion: {
      type: String,
      required: true,
      enum: Object.values(CombustionType),
    },
    originalHp: {
      type: Number,
      required: true,
    },
    originalTorque: {
      type: Number,
      required: true,
    },
    topSpeed: {
      type: Number,
    },
    engineType: {
      type: String,
      required: true,
      enum: Object.values(EngineType),
    },
    files: [
      {
        type: String,
        ref: "File",
      },
    ],
    toolCompatibility: [
      {
        type: String,
        ref: "ToolCompatibility",
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

carModelSchema.pre("save", function (next) {
  if (this.name) {
    this.name = this.name.toUpperCase();
  }
  next();
});

const CarModel = mongoose.model<CarModelDocument>("CarModel", carModelSchema);

export default CarModel;
