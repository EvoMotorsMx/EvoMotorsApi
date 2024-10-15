import { Remission } from "../../../domain/entities";
import { CreateRemissionDTO, UpdateRemissionDTO } from "../../dtos/Remission";

export interface IRemissionService {
  createRemission(dto: CreateRemissionDTO): Promise<Remission>;
  getRemissionById(id: string): Promise<Remission | null>;
  getAllRemissions(): Promise<Remission[]>;
  updateRemission(id: string, dto: UpdateRemissionDTO): Promise<Remission | null>;
  deleteRemission(id: string): Promise<void>;
}
