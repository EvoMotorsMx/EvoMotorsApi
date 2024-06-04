import { Certificate } from "../../../domain/entities";
import { CreateCertificateDTO, UpdateCertificateDTO } from "../../dtos/Certificate";

export interface ICertificateRepository {
  findById(id: string): Promise<Certificate | null>;
  findAll(): Promise<Certificate[]>;
  save(dto: CreateCertificateDTO): Promise<Certificate>;
  update(id: string, dto: UpdateCertificateDTO): Promise<Certificate>;
  deleteById(id: string): Promise<void>;
}
