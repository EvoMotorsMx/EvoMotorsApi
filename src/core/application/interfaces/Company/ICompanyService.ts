import { Company } from "../../../domain/entities";
import { CreateCompanyDTO, UpdateCompanyDTO } from "../../dtos/Company";

export interface ICompanyService {
  createCompany(dto: CreateCompanyDTO): Promise<Company>;
  getCompanyById(id: string): Promise<Company | null>;
  getAllCompanies(): Promise<Company[]>;
  updateCompany(id: string, dto: UpdateCompanyDTO): Promise<Company | null>;
  deleteCompany(id: string): Promise<void>;
}
