import { Car } from "../../../domain/entities/Car";
import { CreateCarDTO, UpdateCarDTO } from "../../dtos/Car";

export interface ICarUseCases {
  createCar(dto: CreateCarDTO): Promise<Car | null>;
  updateCar(id: string, dto: UpdateCarDTO): Promise<Car | null>;
  getCar(id: string): Promise<Car | null>;
  findAllCars(): Promise<Car[]>;
  removeCar(id: string): Promise<void>;
}
