import { ErrorCode } from "../../../domain/entities";
import { CreateErrorCodeDTO, UpdateErrorCodeDTO } from "../../dtos/ErrorCode";

export interface IErrorCodeService {
  createErrorCode(dto: CreateErrorCodeDTO): Promise<ErrorCode>;
  getErrorCodeById(id: string): Promise<ErrorCode | null>;
  getAllErrorCodes(): Promise<ErrorCode[]>;
  updateErrorCode(
    id: string,
    dto: UpdateErrorCodeDTO,
  ): Promise<ErrorCode | null>;
  deleteErrorCode(id: string): Promise<void>;
}
