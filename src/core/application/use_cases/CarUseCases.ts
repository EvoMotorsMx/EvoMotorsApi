import mongoose from "mongoose";
import { Car } from "../../domain/entities";
import { CreateCarDTO, UpdateCarDTO } from "../dtos";
import { ICarService, ICarUseCases, ICustomerService } from "../interfaces";

export class CarUseCases implements ICarUseCases {
  private carService: ICarService;
  private customerService: ICustomerService;

  constructor(carService: ICarService, customerService: ICustomerService) {
    this.carService = carService;
    this.customerService = customerService;
  }

  async findAllCars(): Promise<Car[]> {
    return this.carService.getAllCars();
  }

  async createCar(dto: CreateCarDTO): Promise<Car | null> {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const car = await this.carService.createCar(dto);
      if (!car) {
        throw new Error("Car creation failed");
      }

      const customer = await this.customerService.getCustomerById(
        dto.customerId,
      );
      if (!customer) {
        throw new Error("Customer not found");
      } else {
        const customerCars = customer.cars?.map((car) => car._id as string);
        await this.customerService.updateCustomer(customer._id as string, {
          cars: [...(customerCars || []), car._id as string],
        });
      }

      await session.commitTransaction();
      session.endSession();
      return car;
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  }

  async updateCar(id: string, dto: UpdateCarDTO): Promise<Car | null> {
    return this.carService.updateCar(id, dto);
  }

  async getCar(id: string): Promise<Car | null> {
    return this.carService.getCarById(id);
  }

  async removeCar(id: string): Promise<void> {
    return this.carService.deleteCar(id);
  }
}
