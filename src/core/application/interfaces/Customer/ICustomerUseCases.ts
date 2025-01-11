import { Customer } from "../../../domain/entities";
import { CreateCustomerDTO, UpdateCustomerDTO } from "../../dtos/Customer";

export interface ICustomerUseCases {
  createCustomer(dto: CreateCustomerDTO): Promise<Customer>;
  updateCustomer(id: string, dto: UpdateCustomerDTO): Promise<Customer | null>;
  getCustomer(id: string): Promise<Customer | null>;
  findAllCustomers(): Promise<Customer[]>;
  removeCustomer(id: string): Promise<void>;
}
