import { Certificate } from "../../domain/entities";
import { CreateCertificateDTO, UpdateCertificateDTO } from "../dtos";
import { ICertificateService, ICertificateUseCases } from "../interfaces";

export class CertificateUseCases implements ICertificateUseCases {
  private certificateService: ICertificateService;

  constructor(certificateService: ICertificateService) {
    this.certificateService = certificateService;
  }

  async findAllCertificates(): Promise<Certificate[]> {
    return this.certificateService.getAllCertificates();
  }

  async createCertificate(dto: CreateCertificateDTO): Promise<Certificate> {
    return this.certificateService.createCertificate(dto);
  }

  async updateCertificate(
    id: string,
    dto: UpdateCertificateDTO,
  ): Promise<Certificate | null> {
    return this.certificateService.updateCertificate(id, dto);
  }

  async getCertificate(id: string): Promise<Certificate | null> {
    return this.certificateService.getCertificateById(id);
  }

  async removeCertificate(id: string): Promise<void> {
    return this.certificateService.deleteCertificate(id);
  }
}
