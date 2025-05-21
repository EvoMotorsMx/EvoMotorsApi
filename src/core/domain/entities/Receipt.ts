import { Car, ProductCompatibility, User, Witness } from "./";

export class SignatureData {
  constructor(
    public s3Url: string,
    public timestamp: Date,
    public hash?: string,
  ) {}
}

export class Receipt {
  constructor(
    public installationStatus: "pending" | "completed",
    public tankStatus: number,
    public mileage: number,
    public damageImage: SignatureData, // Updated to use SignatureData
    public scannerDescriptionImages: string[],
    public cognitoId: User,
    public signatureData: SignatureData, // Added signatureData
    public carId?: Car,
    public installationEndDate?: Date,
    public damageStatusDescription?: string,
    public scannerDescription?: string,
    public witnesses?: Witness[],
    public productInstalled?: ProductCompatibility[],
    public _id?: string,
    public createdAt?: Date,
    public updatedAt?: Date, // Added updatedAt to match the schema
  ) {}

  setId(id: string) {
    if (!this._id) {
      this._id = id;
    }
  }
}
