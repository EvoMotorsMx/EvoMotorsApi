import { Car } from "../../../domain/entities/Car";
import { CreateCarDTO, UpdateCarDTO } from "../../dtos/Car";

export interface ICarService {
  createCar(dto: CreateCarDTO): Promise<Car | null>;
  getCarByIdExtended(id: string): Promise<Car | null>;
  getAllCarsExtended(): Promise<Car[]>;
  updateCar(id: string, dto: UpdateCarDTO): Promise<Car | null>;
  deleteCar(id: string): Promise<void>;
}
