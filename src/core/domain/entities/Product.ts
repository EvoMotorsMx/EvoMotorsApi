import { ProductType, ProductSystemType } from "../../../shared/enums";
import { ProductGroup } from "./ProductGroup";

export class Product {
  constructor(
    public name: string,
    public type: ProductType,
    public productGroupId: ProductGroup,
    public description?: string,
    public sku?: string,
    public systemType?: ProductSystemType,
    public price?: number,
    public isComplement?: boolean, // indica si es un complemento
    public _id?: string,
  ) {}

  // Method to set the id if it's not passed in the constructor
  setId(id: string) {
    if (!this._id) {
      this._id = id;
    }
  }
}
