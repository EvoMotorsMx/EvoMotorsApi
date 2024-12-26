import { CombustionType, EngineType } from "../../../../shared/enums";

export type CreateCarModelDTO = {
  name: string;
  brandId: string;
  year: string;
  engineSize: string;
  cylinder: number;
  combustion: CombustionType;
  engineType: EngineType;
  files?: string;
  products: string;
};
