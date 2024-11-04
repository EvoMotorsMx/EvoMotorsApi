import { CreateErrorCodeDTO, UpdateErrorCodeDTO } from "../../application/dtos";
import {
  IErrorCodeRepository,
  IErrorCodeService,
} from "../../application/interfaces";
import { ErrorCode } from "../entities";

export class ErrorCodeService implements IErrorCodeService {
  constructor(private errorCodeRepository: IErrorCodeRepository) {}

  async getErrorCodeById(id: string): Promise<ErrorCode | null> {
    return this.errorCodeRepository.findById(id);
  }

  async getAllErrorCodes(): Promise<ErrorCode[]> {
    return this.errorCodeRepository.findAll();
  }

  async createErrorCode(dto: CreateErrorCodeDTO): Promise<ErrorCode> {
    return this.errorCodeRepository.save(dto);
  }

  async updateErrorCode(
    id: string,
    dto: UpdateErrorCodeDTO,
  ): Promise<ErrorCode | null> {
    return this.errorCodeRepository.update(id, dto);
  }

  async deleteErrorCode(id: string): Promise<void> {
    await this.errorCodeRepository.deleteById(id);
  }
}
