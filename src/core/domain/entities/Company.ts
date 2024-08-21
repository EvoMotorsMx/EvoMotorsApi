export class Company {
  constructor(
    public name: string,
    public city: string,
    public state: string,
    public country: string,
    public phone: string,
    public email: string,
    public users: string[],
    public _id?: string,
  ) {}

  // Method to set the id if it's not passed in the constructor
  setId(id: string) {
    if (!this._id) {
      this._id = id;
    }
  }
}
