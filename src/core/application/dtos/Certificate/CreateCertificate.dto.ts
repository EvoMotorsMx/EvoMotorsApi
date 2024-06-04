export type CreateCertificateDTO = {
  name: string;
  date: number;
  folio: number;
  brand: string;
  modelo?: string;
  year?: number;
  engine?: number;
  vim?: string;
  mileage?: number;
};
