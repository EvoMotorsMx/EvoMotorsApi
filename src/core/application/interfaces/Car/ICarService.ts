import { Car } from "../../../domain/entities/Car";
import { CreateCarDTO, UpdateCarDTO } from "../../dtos/Car";
import { IExtendedCar } from "./IExtendedCar";

export interface ICarService {
  createCar(dto: CreateCarDTO): Promise<Car | null>;
  getCarByIdExtended(id: string): Promise<IExtendedCar | null>;
  getAllCarsExtended(): Promise<IExtendedCar[]>;
  updateCar(id: string, dto: UpdateCarDTO): Promise<Car | null>;
  deleteCar(id: string): Promise<void>;
}
