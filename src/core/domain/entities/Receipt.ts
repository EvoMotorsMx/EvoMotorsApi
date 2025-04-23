import { Car, ErrorCode, ProductCompatibility, User, Witness } from "./";

export class Receipt {
  constructor(
    public signImage: string,
    public installationStatus: "pending" | "completed",
    public tankStatus: number,
    public mileage: number,
    public damageImages: string[],
    public scannerDescriptionImages: string[],
    public cognitoId: User,
    public carId?: Car,
    public installationEndDate?: Date,
    public damageStatusDescription?: string,
    public scannerDescription?: string,
    public witnesses?: Witness[],
    public productInstalled?: ProductCompatibility[],
    public _id?: string,
    public createdAt?: Date,
  ) {}

  setId(id: string) {
    if (!this._id) {
      this._id = id;
    }
  }
}
