import { Certificate } from "../../../domain/entities";
import { CreateCertificateDTO, UpdateCertificateDTO } from "../../dtos/Certificate";

export interface ICertificateService {
  createCertificate(dto: CreateCertificateDTO): Promise<Certificate>;
  getCertificateById(id: string): Promise<Certificate | null>;
  getAllCertificates(): Promise<Certificate[]>;
  updateCertificate(id: string, dto: UpdateCertificateDTO): Promise<Certificate | null>;
  deleteCertificate(id: string): Promise<void>;
}
