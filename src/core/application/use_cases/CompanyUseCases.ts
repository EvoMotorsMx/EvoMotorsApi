import { Company } from "../../domain/entities";
import { CreateCompanyDTO, UpdateCompanyDTO } from "../dtos";
import { ICompanyService, ICompanyUseCases } from "../interfaces";

export class CompanyUseCases implements ICompanyUseCases {
  private companyService: ICompanyService;

  constructor(companyService: ICompanyService) {
    this.companyService = companyService;
  }

  async findAllCompanys(): Promise<Company[]> {
    return this.companyService.getAllCompanys();
  }

  async createCompany(dto: CreateCompanyDTO): Promise<Company> {
    return this.companyService.createCompany(dto);
  }

  async updateCompany(
    id: string,
    dto: UpdateCompanyDTO,
  ): Promise<Company | null> {
    return this.companyService.updateCompany(id, dto);
  }

  async getCompany(id: string): Promise<Company | null> {
    return this.companyService.getCompanyById(id);
  }

  async removeCompany(id: string): Promise<void> {
    return this.companyService.deleteCompany(id);
  }
}
