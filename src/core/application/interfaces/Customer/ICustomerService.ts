import { Car, Customer } from "../../../domain/entities";
import { CreateCustomerDTO, UpdateCustomerDTO } from "../../dtos/Customer";
import { IExtendedCustomer } from "./IExtendedCustomer";

export interface ICustomerService {
  createCustomer(dto: CreateCustomerDTO): Promise<Customer>;
  getCustomerByIdWithCars(id: string): Promise<IExtendedCustomer | null>;
  getAllCustomersWithCars(): Promise<IExtendedCustomer[]>;
  updateCustomer(id: string, dto: UpdateCustomerDTO): Promise<Customer | null>;
  deleteCustomer(id: string): Promise<void>;
}
