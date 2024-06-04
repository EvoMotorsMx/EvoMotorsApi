import { Certificate } from "../../../domain/entities";
import { CreateCertificateDTO, UpdateCertificateDTO } from "../../dtos/Certificate";

export interface ICertificateUseCases {
  createCertificate(dto: CreateCertificateDTO): Promise<Certificate>;
  updateCertificate(id: string, dto: UpdateCertificateDTO): Promise<Certificate | null>;
  getCertificate(id: string): Promise<Certificate | null>;
  findAllCertificates(): Promise<Certificate[]>;
  removeCertificate(id: string): Promise<void>;
}
