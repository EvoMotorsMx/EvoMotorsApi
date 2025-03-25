import { TransmissionType } from "../../../../shared/enums";

export type UpdateCarDTO = {
  vin?: string;
  plates?: string;
  carModelId?: string;
  remissions?: string[];
  customerId?: string;
  errorCodes?: string[];
  year?: number;
  transmissionType?: TransmissionType;
  oriFile?: string;
  modFile?: string;
};
