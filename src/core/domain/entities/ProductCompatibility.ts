import { CarModel, Product } from ".";

export class ProductCompatibility {
  constructor(
    public product: Product,
    public carModel: CarModel,
    public _id?: string,
  ) {}

  // Method to set the id if it's not passed in the constructor
  setId(id: string) {
    if (!this._id) {
      this._id = id;
    }
  }
}
