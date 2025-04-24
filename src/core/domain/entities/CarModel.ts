import { CombustionType, EngineType } from "../../../shared/enums";
import { Brand, File } from "./";

export class CarModel {
  constructor(
    public name: string,
    public brandId: Brand,
    public year: string[],
    public engineSize: string,
    public cylinder: number,
    public combustion: CombustionType,
    public engineType: EngineType,
    public originalHp: number,
    public originalTorque: number,
    public topSpeed?: number,
    public files?: File[] | string[],
    public isActive: boolean = true,
    public _id?: string,
  ) {}

  setId(id: string) {
    if (!this._id) {
      this._id = id;
    }
  }
}
