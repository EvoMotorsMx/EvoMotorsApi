import { CarModel } from "../../../domain/entities/CarModel";
import { CreateCarModelDTO, UpdateCarModelDTO } from "../../dtos/CarModel";

export interface ICarService {
  createCarModel(dto: CreateCarModelDTO): Promise<CarModel>;
  getCarModelById(id: string): Promise<CarModel | null>;
  getAllCarModels(): Promise<CarModel[]>;
  updateCarModel(id: string, dto: UpdateCarModelDTO): Promise<CarModel | null>;
  deleteCarModel(id: string): Promise<void>;
}
