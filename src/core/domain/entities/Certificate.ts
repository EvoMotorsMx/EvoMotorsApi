import { Car } from "./Car";

export class Certificate {
  constructor(
    public carId: Car,
    public _id?: string,
  ) {}

  // Method to set the id if it's not passed in the constructor
  setId(id: string) {
    if (!this._id) {
      this._id = id;
    }
  }
}
