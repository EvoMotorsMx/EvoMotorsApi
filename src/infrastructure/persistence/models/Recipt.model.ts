import mongoose, { Schema, Document } from "mongoose";
import { v4 as uuidV4 } from "uuid";
import { isBase64 } from "validator";

interface ReceiptDocument extends Document {
  _id: string;
  cognitoId: string;
  productId: string[];
  arriveTime: Date;
  endTime: Date;
  signatureImage: String;
}

const receiptSchema = new Schema<ReceiptDocument>(
  {
    _id: {
      type: String,
      default: () => uuidV4(),
    },
    cognitoId: {
      type: String,
      required: true,
      index: true,
    },
    productId: [
      {
        type: String,
        required: true,
        ref: "Product",
      },
    ],
    arriveTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
      required: true,
    },
    signatureImage: {
      type: String,
      required: true,
      validate: {
        validator: function (value) {
          return isBase64(value);
        },
        message: (props) => `${props.value} is not a valid base64 string!`,
      },
    },
  },
  {
    timestamps: true,
  },
);

const Receipt = mongoose.model<ReceiptDocument>("Receipt", receiptSchema);

export default Receipt;
