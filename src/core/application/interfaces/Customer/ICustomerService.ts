import { Customer } from "../../../domain/entities";
import { CreateCustomerDTO, UpdateCustomerDTO } from "../../dtos/Customer";

export interface ICustomerService {
  createCustomer(dto: CreateCustomerDTO): Promise<Customer>;
  getCustomerById(id: string): Promise<Customer | null>;
  getAllCustomers(): Promise<Customer[]>;
  updateCustomer(id: string, dto: UpdateCustomerDTO): Promise<Customer | null>;
  deleteCustomer(id: string): Promise<void>;
}
