import { Car, Customer } from "../../../domain/entities";
import { CreateCustomerDTO, UpdateCustomerDTO } from "../../dtos/Customer";

export interface ICustomerService {
  createCustomer(dto: CreateCustomerDTO): Promise<Customer>;
  getCustomerByIdWithCars(
    id: string,
  ): Promise<{ customer: Customer; cars: Car[] } | null>;
  getAllCustomersWithCars(): Promise<{ customer: Customer; cars: Car[] }[]>;
  updateCustomer(id: string, dto: UpdateCustomerDTO): Promise<Customer | null>;
  deleteCustomer(id: string): Promise<void>;
}
