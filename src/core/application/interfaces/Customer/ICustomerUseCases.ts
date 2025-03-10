import { Car, Customer } from "../../../domain/entities";
import { CreateCustomerDTO, UpdateCustomerDTO } from "../../dtos/Customer";
import { IExtendedCustomer } from "./IExtendedCustomer";

export interface ICustomerUseCases {
  createCustomer(dto: CreateCustomerDTO): Promise<Customer>;
  updateCustomer(id: string, dto: UpdateCustomerDTO): Promise<Customer | null>;
  getCustomerWithCars(id: string): Promise<IExtendedCustomer | null>;
  getAllCustomersWithCars(): Promise<IExtendedCustomer[]>;
  removeCustomer(id: string): Promise<void>;
}
