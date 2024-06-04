import { Remission } from "../../../domain/entities";
import { CreateRemissionDTO, UpdateRemissionDTO } from "../../dtos/Remission";

export interface IRemissionRepository {
  findById(id: string): Promise<Remission | null>;
  findAll(): Promise<Remission[]>;
  save(dto: CreateRemissionDTO): Promise<Remission>;
  update(id: string, dto: UpdateRemissionDTO): Promise<Remission>;
  deleteById(id: string): Promise<void>;
}
