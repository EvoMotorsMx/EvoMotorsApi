import { Tool } from "../../../domain/entities";
import { CreateToolDTO, UpdateToolDTO } from "../../dtos/Tool";

export interface IToolRepository {
  findById(id: string): Promise<Tool | null>;
  findAll(): Promise<Tool[]>;
  save(dto: CreateToolDTO): Promise<Tool>;
  update(id: string, dto: UpdateToolDTO): Promise<Tool>;
  deleteById(id: string): Promise<void>;
}
