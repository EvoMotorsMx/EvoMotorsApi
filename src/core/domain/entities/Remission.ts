export class Remission {
  constructor(
    public name: string,
    public _id?: string,
    public remission?: number,
    public date?: number,
    public contact?: string,
    public cellphone?: number,
    public city?: string,
    public brand?: string,
    public modelo?: string,
    public email?: string,
    public socialNetwork?: string,
    public rfc?: string,
    public bill?: string,
    public cfdiUse?: string,
    public mileage?: number,
    public year?: number,
    public engine?: number,
    public vim?: string,
  ) {}

  // Method to set the id if it's not passed in the constructor
  setId(id: string) {
    if (!this._id) {
      this._id = id;
    }
  }
}
