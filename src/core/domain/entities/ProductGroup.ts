import { ProductType, ProductSystemType } from "../../../shared/enums";

export class ProductGroup {
  constructor(
    public name: string,
    public productBrandId: string, // FK → ProductBrand
    public description?: string,
    public image?: string,
    public _id?: string,
  ) {}

  // Method to set the id if it's not passed in the constructor
  setId(id: string) {
    if (!this._id) {
      this._id = id;
    }
  }
}
