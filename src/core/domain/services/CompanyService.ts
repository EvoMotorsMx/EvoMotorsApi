import { CreateCompanyDTO, UpdateCompanyDTO } from "../../application/dtos";
import {
  ICompanyRepository,
  ICompanyService,
} from "../../application/interfaces";
import { Company } from "../entities";

export class CompanyService implements ICompanyService {
  constructor(private companyRepository: ICompanyRepository) {}

  async getCompanyById(id: string): Promise<Company | null> {
    return this.companyRepository.findById(id);
  }

  async getAllCompanys(): Promise<Company[]> {
    return this.companyRepository.findAll();
  }

  async createCompany(dto: CreateCompanyDTO): Promise<Company> {
    return this.companyRepository.save(dto);
  }

  async updateCompany(
    id: string,
    dto: UpdateCompanyDTO,
  ): Promise<Company | null> {
    return this.companyRepository.update(id, dto);
  }

  async deleteCompany(id: string): Promise<void> {
    await this.companyRepository.deleteById(id);
  }
}
