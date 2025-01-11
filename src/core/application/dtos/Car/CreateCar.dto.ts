import { CombustionType, EngineType } from "../../../../shared/enums";

export type CreateCarDTO = {
  name: string;
  brandId: string;
  carModelId: string;
  year: string;
  engineSize: string;
  cylinder: number;
  combustion: CombustionType;
  engineType: EngineType;
  customerId: string;
  mileage: number;
  tankStatus: number;
  damageImageUrl?: string[];
  damageStatusDescription: string;
  scannerDescription: string;
  vin: string;
  plates: string;
  certificateId?: string;
  remissions?: string[];
  witnesses?: string[];
  errorCodes?: string[];
  files?: string[];
};
