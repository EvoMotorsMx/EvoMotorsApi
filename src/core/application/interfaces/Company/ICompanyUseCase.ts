import { Company } from "../../../domain/entities/Company";
import { CreateCompanyDTO, UpdateCompanyDTO } from "../../dtos/Company";

export interface ICompanyUseCases {
  createCompany(dto: CreateCompanyDTO): Promise<Company>;
  updateCompany(id: string, dto: UpdateCompanyDTO): Promise<Company | null>;
  getCompany(id: string): Promise<Company | null>;
  findAllCompanys(): Promise<Company[]>;
  removeCompany(id: string): Promise<void>;
}
