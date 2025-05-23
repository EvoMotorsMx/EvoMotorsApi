export interface CreateReceiptDTO {
  installationEndDate?: Date;
  installationStatus: string;
  tankStatus: number;
  mileage: number;
  damageImage: string; // Updated to use SignatureData
  damageStatusDescription?: string;
  scannerDescriptionImages: string[];
  scannerDescription?: string;
  errorCodes?: string[];
  carId: string;
  cognitoId: string;
  witnesses?: string[];
  productInstalled: string[];
  signImage: string; // Added signatureData
}
