export type CreateCarDTO = {
  vin: string;
  plates: string;
  carModelId: string;
  certificateId: string;
  remissions: string[];
  customerId: string;
  errorCodes: string[];
  files: string[];
};
