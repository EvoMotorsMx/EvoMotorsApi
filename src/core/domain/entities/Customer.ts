import { ContactType } from "../../../shared/enums";
import { Car, Remission } from "./";

export class Customer {
  constructor(
    public name: string,
    public lastName: string,
    public city: string,
    public state: string,
    public country: string,
    public phone: string,
    public email: string,
    public rfc: string,
    public razonSocial: string,
    public contacto: ContactType,
    public remissions?: Remission[],
    public cars?: Car[],
    public _id?: string,
  ) {}

  // Method to set the id if it's not passed in the constructor
  setId(id: string) {
    if (!this._id) {
      this._id = id;
    }
  }
}
