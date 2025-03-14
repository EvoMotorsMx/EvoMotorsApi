import { Customer } from "../../domain/entities";
import { CreateCustomerDTO, UpdateCustomerDTO } from "../dtos";
import { ICustomerService, ICustomerUseCases } from "../interfaces";

export class CustomerUseCases implements ICustomerUseCases {
  private customerService: ICustomerService;

  constructor(customerService: ICustomerService) {
    this.customerService = customerService;
  }

  async getAllCustomersWithCars() {
    return this.customerService.getAllCustomersWithCars();
  }

  async createCustomer(dto: CreateCustomerDTO): Promise<Customer> {
    return this.customerService.createCustomer(dto);
  }

  async updateCustomer(
    id: string,
    dto: UpdateCustomerDTO,
  ): Promise<Customer | null> {
    return this.customerService.updateCustomer(id, dto);
  }

  async getCustomerWithCars(id: string) {
    return this.customerService.getCustomerByIdWithCars(id);
  }

  async removeCustomer(id: string): Promise<void> {
    return this.customerService.deleteCustomer(id);
  }
}
