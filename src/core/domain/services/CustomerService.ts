import { CreateCustomerDTO, UpdateCustomerDTO } from "../../application/dtos";
import {
  ICustomerRepository,
  ICustomerService,
} from "../../application/interfaces";
import { Customer } from "../entities";

export class CustomerService implements ICustomerService {
  constructor(private customerRepository: ICustomerRepository) {}

  async getCustomerById(id: string): Promise<Customer | null> {
    return this.customerRepository.findById(id);
  }

  async getAllCustomers(): Promise<Customer[]> {
    return this.customerRepository.findAll();
  }

  async createCustomer(dto: CreateCustomerDTO): Promise<Customer> {
    return this.customerRepository.save(dto);
  }

  async updateCustomer(
    id: string,
    dto: UpdateCustomerDTO,
  ): Promise<Customer | null> {
    return this.customerRepository.update(id, dto);
  }

  async deleteCustomer(id: string): Promise<void> {
    await this.customerRepository.deleteById(id);
  }
}
