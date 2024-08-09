import { CombustionType, EngineType } from "../../../../shared/enums";

export type CreateCarDTO = {
  name: string;
  brandId: string;
  year: string;
  engineSize: string;
  cylinder: number;
  combustion: CombustionType;
  engineType: EngineType;
  files?: string;
};
