import { Company } from "../../../domain/entities";
import { CreateCompanyDTO, UpdateCompanyDTO } from "../../dtos/Company";

export interface ICompanyRepository {
  findById(id: string): Promise<Company | null>;
  findAll(): Promise<Company[]>;
  save(dto: CreateCompanyDTO): Promise<Company>;
  update(id: string, dto: UpdateCompanyDTO): Promise<Company>;
  deleteById(id: string): Promise<void>;
}
