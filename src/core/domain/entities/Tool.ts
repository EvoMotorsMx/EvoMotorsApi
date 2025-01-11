export class Tool {
  constructor(
    public name: string,
    public totalQuantity: number,
    public availableQuantity: number,
    public description?: string,
    public _id?: string,
  ) {}

  // Method to set the id if it's not passed in the constructor
  setId(id: string) {
    if (!this._id) {
      this._id = id;
    }
  }
}
