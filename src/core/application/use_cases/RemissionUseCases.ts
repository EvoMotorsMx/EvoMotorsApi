import { Remission } from "../../domain/entities";
import { CreateRemissionDTO, UpdateRemissionDTO } from "../dtos";
import { IRemissionService, IRemissionUseCases } from "../interfaces";

export class RemissionUseCases implements IRemissionUseCases {
  private remissionService: IRemissionService;

  constructor(remissionService: IRemissionService) {
    this.remissionService = remissionService;
  }

  async findAllRemissions(): Promise<Remission[]> {
    return this.remissionService.getAllRemissions();
  }

  async createRemission(dto: CreateRemissionDTO): Promise<Remission> {
    return this.remissionService.createRemission(dto);
  }

  async updateRemission(
    id: string,
    dto: UpdateRemissionDTO,
  ): Promise<Remission | null> {
    return this.remissionService.updateRemission(id, dto);
  }

  async getRemission(id: string): Promise<Remission | null> {
    return this.remissionService.getRemissionById(id);
  }

  async removeRemission(id: string): Promise<void> {
    return this.remissionService.deleteRemission(id);
  }
}
