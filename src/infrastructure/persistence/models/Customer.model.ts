import mongoose, { Schema, Document } from "mongoose";
import { v4 as uuidV4 } from "uuid";
import { Car, Remission } from "../../../core/domain/entities";
import { ContactType } from "../../../shared/enums";

export interface CustomerDocument extends Document {
  name: string;
  lastName: string;
  city: string;
  state: string;
  country: string;
  phone: string;
  email: string;
  rfc: string;
  razonSocial: string;
  contacto: ContactType;
  remissions: Remission[];
  cars: Car[];
  company: string;
}

const customerSchema = new Schema<CustomerDocument>(
  {
    _id: {
      type: String,
      default: () => uuidV4(),
    },
    name: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      unique: true,
    },
    rfc: {
      type: String,
      unique: true,
    },
    razonSocial: {
      type: String,
      unique: true,
    },
    contacto: {
      type: String,
      required: true,
      enum: Object.values(ContactType),
    },
    remissions: [
      {
        type: String,
        ref: "Remission",
      },
    ],
    cars: [
      {
        type: String,
        ref: "Car",
      },
    ],
    company: {
      type: String,
      ref: "Company",
    },
  },
  {
    timestamps: true,
  },
);

customerSchema.pre("save", function (next) {
  this.name = this.name.toUpperCase();
  this.lastName = this.lastName.toUpperCase();
  this.city = this.city.toUpperCase();
  this.state = this.state.toUpperCase();
  this.country = this.country.toUpperCase();
  next();
});

customerSchema.set("autoIndex", false);

const Customer = mongoose.model<CustomerDocument>("Customer", customerSchema);

export default Customer;
