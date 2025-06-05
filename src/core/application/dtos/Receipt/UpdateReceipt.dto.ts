export interface UpdateReceiptDTO {
  installationInitDate?: Date;
  installationEndDate?: Date;
  installationStatus?: "pending" | "completed";
  tankStatus?: number;
  mileage?: number;
  damageImage?: string; // Updated to use SignatureData
  damageStatusDescription?: string;
  scannerDescriptionImages?: string[];
  scannerDescription?: string;
  errorCodes?: string[];
  carId?: string;
  witnesses?: string[];
  productId?: string[];
  signImage?: string; // Added signatureData
}
