import { Brand } from "./index";

export class ErrorCode {
  constructor(
    public code: string,
    public name: string,
    public brand: Brand,
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
