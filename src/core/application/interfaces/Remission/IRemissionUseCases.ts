import { Remission } from "../../../domain/entities";
import { CreateRemissionDTO, UpdateRemissionDTO } from "../../dtos/Remission";

export interface IRemissionUseCases {
  createRemission(dto: CreateRemissionDTO): Promise<Remission>;
  updateRemission(id: string, dto: UpdateRemissionDTO): Promise<Remission | null>;
  getRemission(id: string): Promise<Remission | null>;
  findAllRemissions(): Promise<Remission[]>;
  removeRemission(id: string): Promise<void>;
}
