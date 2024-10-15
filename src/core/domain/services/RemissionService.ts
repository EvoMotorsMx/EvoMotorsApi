import { CreateRemissionDTO, UpdateRemissionDTO } from "../../application/dtos";
import {
  IRemissionRepository,
  IRemissionService,
} from "../../application/interfaces";
import { Remission } from "../entities";

export class RemissionService implements IRemissionService {
  constructor(private remissionRepository: IRemissionRepository) {}

  async getRemissionById(id: string): Promise<Remission | null> {
    return this.remissionRepository.findById(id);
  }

  async getAllRemissions(): Promise<Remission[]> {
    return this.remissionRepository.findAll();
  }

  async createRemission(dto: CreateRemissionDTO): Promise<Remission> {
    return this.remissionRepository.save(dto);
  }

  async updateRemission(
    id: string,
    dto: UpdateRemissionDTO,
  ): Promise<Remission | null> {
    return this.remissionRepository.update(id, dto);
  }

  async deleteRemission(id: string): Promise<void> {
    await this.remissionRepository.deleteById(id);
  }
}
