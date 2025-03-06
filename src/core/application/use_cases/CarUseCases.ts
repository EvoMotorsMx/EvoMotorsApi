import mongoose from "mongoose";
import { Car } from "../../domain/entities";
import { CreateCarDTO, UpdateCarDTO } from "../dtos";
import { ICarService, ICarUseCases } from "../interfaces";

export class CarUseCases implements ICarUseCases {
  private carService: ICarService;

  constructor(carService: ICarService) {
    this.carService = carService;
  }

  async findAllCars(): Promise<Car[]> {
    return this.carService.getAllCars();
  }

  async createCar(dto: CreateCarDTO): Promise<Car | null> {
    return this.carService.createCar(dto);
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
