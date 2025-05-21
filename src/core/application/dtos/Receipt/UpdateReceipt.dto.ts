import { SignatureData } from "../../../domain/entities/Receipt";

export interface UpdateReceiptDTO {
  installationInitDate?: Date;
  installationEndDate?: Date;
  installationStatus?: "pending" | "completed";
  tankStatus?: number;
  mileage?: number;
  damageImage?: SignatureData; // Updated to use SignatureData
  damageStatusDescription?: string;
  scannerDescriptionImages?: string[];
  scannerDescription?: string;
  errorCodes?: string[];
  carId?: string;
  witnesses?: string[];
  productId?: string[];
  signatureData?: SignatureData; // Added signatureData
}
