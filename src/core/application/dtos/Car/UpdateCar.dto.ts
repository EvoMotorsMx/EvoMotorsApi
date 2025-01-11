import { CombustionType, EngineType } from "../../../../shared/enums";

export type UpdateCarDTO = {
  name?: string;
  brandId?: string;
  carModelId?: string;
  year?: string;
  engineSize?: string;
  cylinder?: number;
  combustion?: CombustionType;
  engineType?: EngineType;
  mileage?: number;
  tankStatus?: number;
  damageImageUrl?: string[];
  damageStatusDescription?: string;
  scannerDescription?: string;
  vin?: string;
  plates?: string;
  customerId?: string;
  certificateId?: string;
  remissions?: string[];
  witnesses?: string[];
  errorCodes?: string[];
  files?: string[];
};
