import { CreateCarDTO, UpdateCarDTO } from "../../application/dtos";
import { ICarRepository, ICarService } from "../../application/interfaces";
import { Car } from "../entities";

export class CarService implements ICarService {
  constructor(private carRepository: ICarRepository) {}

  async getCarById(id: string): Promise<Car | null> {
    return this.carRepository.findById(id);
  }

  async getAllCars(): Promise<Car[]> {
    return this.carRepository.findAll();
  }

  async createCar(dto: CreateCarDTO): Promise<Car | null> {
    return this.carRepository.save(dto);
  }

  async updateCar(id: string, dto: UpdateCarDTO): Promise<Car | null> {
    return this.carRepository.update(id, dto);
  }

  async deleteCar(id: string): Promise<void> {
    await this.carRepository.deleteById(id);
  }
}
