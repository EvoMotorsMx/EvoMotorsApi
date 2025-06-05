export class ProductBrand {
  constructor(
    public name: string,
    public logo?: string, // Optional logo for the product brand
    public description?: string, // Optional description for the product brand
    public _id?: string,
  ) {}

  // Method to set the id if it's not passed in the constructor
  setId(id: string) {
    if (!this._id) {
      this._id = id;
    }
  }
}
