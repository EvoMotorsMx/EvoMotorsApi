import { CombustionType, EngineType } from "../../../shared/enums";
import { Brand, CarModel, Certificate, Remission, Witness } from "./index";

export class Car {
  constructor(
    public mileage: number,
    public tankStatus: number,
    public damangeImageUrl: number,
    public statusDescription: string,
    public damangeDescription: string,
    public scannerDescription: string,
    public vin: EngineType,
    public plates: string,
    public certifacteId: Certificate | string,
    public leadId: string,
    public carModelId: CarModel | string,
    public _id?: string,
    public remissions?: Remission[] | string[],
    public witnesses?: Witness[] | string[],
  ) {}

  setId(id: string) {
    if (!this._id) {
      this._id = id;
    }
  }
}
