import { CreateCustomerDTO, UpdateCustomerDTO } from "../../application/dtos";
import {
  ICarRepository,
  ICustomerRepository,
  ICustomerService,
} from "../../application/interfaces";
import { Car, Customer } from "../entities";

export class CustomerService implements ICustomerService {
  constructor(
    private customerRepository: ICustomerRepository,
    private carRepository: ICarRepository,
  ) {}

  async getCustomerByIdWithCars(
    id: string,
  ): Promise<{ customer: Customer; cars: Car[] } | null> {
    const customer = await this.customerRepository.findById(id);
    if (!customer) return null;

    const cars = await this.carRepository.findAll(customer._id?.toString()!);
    return { customer, cars };
  }

  async getAllCustomersWithCars(): Promise<
    { customer: Customer; cars: Car[] }[]
  > {
    const customers = await this.customerRepository.findAll();
    const result = [];
    for (const customer of customers) {
      const cars = await this.carRepository.findAll(customer._id?.toString()!);
      result.push({ customer, cars });
    }
    return result;
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
