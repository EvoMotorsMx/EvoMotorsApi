import { CarModel } from "../../../domain/entities/CarModel";
import { CreateCarModelDTO, UpdateCarModelDTO } from "../../dtos/CarModel";

export interface ICarModelRepository {
  findById(id: string): Promise<CarModel | null>;
  findAll(): Promise<CarModel[]>;
  save(dto: CreateCarModelDTO): Promise<CarModel>;
  update(id: string, dto: UpdateCarModelDTO): Promise<CarModel>;
  deleteById(id: string): Promise<void>;
  getQuery():any
}
