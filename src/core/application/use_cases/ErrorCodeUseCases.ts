import { ErrorCode } from "../../domain/entities";
import { CreateErrorCodeDTO, UpdateErrorCodeDTO } from "../dtos";
import { IErrorCodeService, IErrorCodeUseCases } from "../interfaces";

export class ErrorCodeUseCases implements IErrorCodeUseCases {
  private errorCodeService: IErrorCodeService;

  constructor(errorCodeService: IErrorCodeService) {
    this.errorCodeService = errorCodeService;
  }

  async findAllErrorCodes(): Promise<ErrorCode[]> {
    return this.errorCodeService.getAllErrorCodes();
  }

  async createErrorCode(dto: CreateErrorCodeDTO): Promise<ErrorCode> {
    return this.errorCodeService.createErrorCode(dto);
  }

  async updateErrorCode(
    id: string,
    dto: UpdateErrorCodeDTO,
  ): Promise<ErrorCode | null> {
    return this.errorCodeService.updateErrorCode(id, dto);
  }

  async getErrorCode(id: string): Promise<ErrorCode | null> {
    return this.errorCodeService.getErrorCodeById(id);
  }

  async removeErrorCode(id: string): Promise<void> {
    return this.errorCodeService.deleteErrorCode(id);
  }
}
