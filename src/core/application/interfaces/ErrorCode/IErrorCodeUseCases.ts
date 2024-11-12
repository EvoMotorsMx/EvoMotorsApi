import { ErrorCode } from "../../../domain/entities";
import { CreateErrorCodeDTO, UpdateErrorCodeDTO } from "../../dtos/ErrorCode";

export interface IErrorCodeUseCases {
  createErrorCode(dto: CreateErrorCodeDTO): Promise<ErrorCode>;
  updateErrorCode(
    id: string,
    dto: UpdateErrorCodeDTO,
  ): Promise<ErrorCode | null>;
  getErrorCode(id: string): Promise<ErrorCode | null>;
  findAllErrorCodes(): Promise<ErrorCode[]>;
  removeErrorCode(id: string): Promise<void>;
}
