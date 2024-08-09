import { Car } from "../../../domain/entities/Car";
import { CreateCarDTO, UpdateCarDTO } from "../../dtos/Car";

export interface ICarRepository {
  findById(id: string): Promise<Car | null>;
  findAll(): Promise<Car[]>;
  save(dto: CreateCarDTO): Promise<Car | null>;
  update(id: string, dto: UpdateCarDTO): Promise<Car>;
  deleteById(id: string): Promise<void>;
}
