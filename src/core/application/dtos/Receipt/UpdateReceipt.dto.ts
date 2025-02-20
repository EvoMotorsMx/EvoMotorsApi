export interface UpdateReceiptDTO {
  installationInitDate?: Date;
  installationEndDate?: Date;
  signImage?: string;
  installationStatus?: "pending" | "completed";
  tankStatus?: number;
  mileage?: number;
  damageImages?: string[];
  damageStatusDescription?: string;
  scannerDescriptionImages?: string[];
  scannerDescription?: string;
  errorCodes?: string[];
  carId?: string;
  witnesses?: string[];
  productId?: string[];
}
