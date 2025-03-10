import { HttpIntegrationSubtype } from "aws-cdk-lib/aws-apigatewayv2";
import { CreateCarDTO, UpdateCarDTO } from "../../application/dtos";
import {
  ICarRepository,
  ICarService,
  IReceiptRepository,
} from "../../application/interfaces";
import { Car } from "../entities";

export class CarService implements ICarService {
  constructor(
    private carRepository: ICarRepository,
    private receiptRepository: IReceiptRepository,
  ) {}

  //GETS CAR Certificate, Orders and Remissions
  async getCarByIdExtended(id: string) {
    const car = await this.carRepository.findById(id);
    if (!car) {
      return null;
    }
    const receipts = await this.receiptRepository.findAll(car._id?.toString());
    return { ...car, receipts, setId: car.setId.bind(car) };
  }

  //GETS CAR Certificate, Orders and Remissions
  async getAllCarsExtended() {
    const cars = await this.carRepository.findAll();
    const result = [];
    for (const car of cars) {
      const receipts = await this.receiptRepository.findAll(
        car._id?.toString()!,
      );
      result.push({ ...car, receipts, setId: car.setId.bind(car) });
    }
    return result;
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
