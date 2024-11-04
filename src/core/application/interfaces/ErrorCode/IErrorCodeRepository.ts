import { ErrorCode } from "../../../domain/entities";
import { CreateErrorCodeDTO, UpdateErrorCodeDTO } from "../../dtos/ErrorCode";

export interface IErrorCodeRepository {
  findById(id: string): Promise<ErrorCode | null>;
  findAll(): Promise<ErrorCode[]>;
  save(dto: CreateErrorCodeDTO): Promise<ErrorCode>;
  update(id: string, dto: UpdateErrorCodeDTO): Promise<ErrorCode>;
  deleteById(id: string): Promise<void>;
}
