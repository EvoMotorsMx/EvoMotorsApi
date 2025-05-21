import { SignatureData } from "../../../domain/entities/Receipt";

export interface CreateReceiptDTO {
  installationEndDate?: Date;
  installationStatus: "pending" | "completed";
  tankStatus: number;
  mileage: number;
  damageImage: SignatureData; // Updated to use SignatureData
  damageStatusDescription?: string;
  scannerDescriptionImages: string[];
  scannerDescription?: string;
  errorCodes?: string[];
  carId: string;
  cognitoId: string;
  witnesses?: string[];
  productInstalled: string[];
  signatureData: SignatureData; // Added signatureData
}
