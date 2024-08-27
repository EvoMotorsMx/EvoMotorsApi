import { Company } from "../../domain/entities";
import { CreateCompanyDTO, UpdateCompanyDTO } from "../dtos";
import { ICompanyService, ICompanyUseCases } from "../interfaces";

export class CompanyUseCases implements ICompanyUseCases {
  private brandService: ICompanyService;

  constructor(brandService: ICompanyService) {
    this.brandService = brandService;
  }

  async findAllCompanys(): Promise<Company[]> {
    return this.brandService.getAllCompanys();
  }

  async createCompany(dto: CreateCompanyDTO): Promise<Company> {
    return this.brandService.createCompany(dto);
  }

  async updateCompany(
    id: string,
    dto: UpdateCompanyDTO,
  ): Promise<Company | null> {
    return this.brandService.updateCompany(id, dto);
  }

  async getCompany(id: string): Promise<Company | null> {
    return this.brandService.getCompanyById(id);
  }

  async removeCompany(id: string): Promise<void> {
    return this.brandService.deleteCompany(id);
  }
}
