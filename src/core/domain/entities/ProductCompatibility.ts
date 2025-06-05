import { CarModel, Product } from ".";

export class ProductCompatibility {
  constructor(
    public product: Product,
    public carModel: CarModel,
    public endHp?: number, // Optional field for end horsepower
    public endTorque?: number, // Optional field for end torque
    public vMax?: string, // Optional field for maximum speed
    public priceOverride?: number, // Optional field for price override
    public priceAdditional?: number, // Optional field for additional price
    public notes?: string, // Optional field for notes
    public description?: string, // Optional field for description
    public complementId?: Product, // Optional field for complement product
    public _id?: string,
  ) {}

  // Method to set the id if it's not passed in the constructor
  setId(id: string) {
    if (!this._id) {
      this._id = id;
    }
  }
}
