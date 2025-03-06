import { Car, Customer } from "../../../domain/entities";
import { CreateCustomerDTO, UpdateCustomerDTO } from "../../dtos/Customer";

export interface ICustomerUseCases {
  createCustomer(dto: CreateCustomerDTO): Promise<Customer>;
  updateCustomer(id: string, dto: UpdateCustomerDTO): Promise<Customer | null>;
  getCustomerWithCars(
    id: string,
  ): Promise<{ customer: Customer; cars: Car[] } | null>;
  getAllCustomersWithCars(): Promise<{ customer: Customer; cars: Car[] }[]>;
  removeCustomer(id: string): Promise<void>;
}
