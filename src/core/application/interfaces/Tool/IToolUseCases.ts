import { Tool } from "../../../domain/entities";
import { CreateToolDTO, UpdateToolDTO } from "../../dtos/Tool";

export interface IToolUseCases {
  createTool(dto: CreateToolDTO): Promise<Tool>;
  updateTool(id: string, dto: UpdateToolDTO): Promise<Tool | null>;
  getTool(id: string): Promise<Tool | null>;
  findAllTools(): Promise<Tool[]>;
  removeTool(id: string): Promise<void>;
}
