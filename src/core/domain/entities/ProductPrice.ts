import { CarModel, Product } from ".";

export class ProductPrice {
  constructor(
    public carModelId: CarModel,
    public productId: Product,
    public price: number,
    public hpIncrement: number,
    public torqueIncrement: number,
    public _id?: string,
  ) {}

  // Method to set the id if it's not passed in the constructor
  setId(id: string) {
    if (!this._id) {
      this._id = id;
    }
  }
}
