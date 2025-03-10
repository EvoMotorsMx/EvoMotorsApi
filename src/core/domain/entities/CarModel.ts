import { CombustionType, EngineType } from "../../../shared/enums";
import { Brand, File } from "./index";

export class CarModel {
  constructor(
    public name: string,
    public brandId: Brand,
    public year: string[],
    public engineSize: string,
    public cylinder: number,
    public combustion: CombustionType,
    public engineType: EngineType,
    public files?: File[] | string[],
    public _id?: string,
  ) {}

  setId(id: string) {
    if (!this._id) {
      this._id = id;
    }
  }
}
