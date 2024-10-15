import { CreateCertificateDTO, UpdateCertificateDTO } from "../../application/dtos";
import {
  ICertificateRepository,
  ICertificateService,
} from "../../application/interfaces";
import { Certificate } from "../entities";

export class CertificateService implements ICertificateService {
  constructor(private certificateRepository: ICertificateRepository) {}

  async getCertificateById(id: string): Promise<Certificate | null> {
    return this.certificateRepository.findById(id);
  }

  async getAllCertificates(): Promise<Certificate[]> {
    return this.certificateRepository.findAll();
  }

  async createCertificate(dto: CreateCertificateDTO): Promise<Certificate> {
    return this.certificateRepository.save(dto);
  }

  async updateCertificate(
    id: string,
    dto: UpdateCertificateDTO,
  ): Promise<Certificate | null> {
    return this.certificateRepository.update(id, dto);
  }

  async deleteCertificate(id: string): Promise<void> {
    await this.certificateRepository.deleteById(id);
  }
}
