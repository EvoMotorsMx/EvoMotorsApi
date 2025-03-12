import { Car, Customer } from "../../../domain/entities";

export interface IExtendedCustomer extends Customer {
  cars: Car[];
}
