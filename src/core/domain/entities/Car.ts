import { CarModel, Certificate, Customer, Remission } from "./index";

export class Car {
  constructor(
    public vin: string,
    public plates: string,
    public carModelId: CarModel,
    public customerId: Customer,
    public oriFile?: File,
    public modFile?: File,
    public _id?: string,
  ) {}

  setId(id: string) {
    if (!this._id) {
      this._id = id;
    }
  }
}
