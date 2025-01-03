import { Customer } from "../../../domain/entities";
import { CreateCustomerDTO, UpdateCustomerDTO } from "../../dtos/Customer";

export interface ICustomerRepository {
  findById(id: string): Promise<Customer | null>;
  findAll(): Promise<Customer[]>;
  save(dto: CreateCustomerDTO): Promise<Customer>;
  update(id: string, dto: UpdateCustomerDTO): Promise<Customer>;
  deleteById(id: string): Promise<void>;
}
