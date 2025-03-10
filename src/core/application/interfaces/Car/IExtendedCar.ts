import { Car, Receipt } from "../../../domain/entities";

export interface IExtendedCar extends Car {
  receipts: Receipt[];
  //remissions
  //certificate
}
