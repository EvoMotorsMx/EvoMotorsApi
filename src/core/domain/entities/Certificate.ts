export class Certificate {
  constructor(
    public name: string,
    public _id?: string,
    public date?: number,
    public folio?: number,
    public brand?: string,
    public modelo?: string,
    public year?: number,
    public engine?: number,
    public vim?: string,
    public mileage?: number,
  ) {}

  // Method to set the id if it's not passed in the constructor
  setId(id: string) {
    if (!this._id) {
      this._id = id;
    }
  }
}
