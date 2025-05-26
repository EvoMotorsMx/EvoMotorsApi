import { ProductType, ProductSystemType } from "../../../shared/enums";

export class Product {
  constructor(
    public name: string,
    public type: ProductType,
    public description?: string,
    public sku?: string,
    public productGroupId?: string,
    public systemType?: ProductSystemType,
    public stock?: number,
    public price?: number,
    public isComplement?: boolean, // indica si es un complemento
    public complementId?: string | null, // FK → Product, puede ser nulo si no es un complemento
    public _id?: string,
  ) {}

  // Method to set the id if it's not passed in the constructor
  setId(id: string) {
    if (!this._id) {
      this._id = id;
    }
  }
}
