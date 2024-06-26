import { CreateCarModelDTO, UpdateCarModelDTO } from "../../application/dtos";
import {
  ICarModelRepository,
  ICarModelService,
} from "../../application/interfaces";
import { CarModel } from "../entities";

export class CarModelService implements ICarModelService {
  constructor(private carModelRepository: ICarModelRepository) {}

  async getCarModelById(id: string): Promise<CarModel | null> {
    return this.carModelRepository.findById(id);
  }

  async getAllCarModels(): Promise<CarModel[]> {
    return this.carModelRepository.findAll();
  }

  async createCarModel(dto: CreateCarModelDTO): Promise<CarModel> {
    return this.carModelRepository.save(dto);
  }

  async updateCarModel(
    id: string,
    dto: UpdateCarModelDTO,
  ): Promise<CarModel | null> {
    return this.carModelRepository.update(id, dto);
  }

  async deleteCarModel(id: string): Promise<void> {
    await this.carModelRepository.deleteById(id);
  }
}
