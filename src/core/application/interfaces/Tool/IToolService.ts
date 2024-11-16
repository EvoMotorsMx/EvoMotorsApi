import { Tool } from "../../../domain/entities";
import { CreateToolDTO, UpdateToolDTO } from "../../dtos/Tool";

export interface IToolService {
  createTool(dto: CreateToolDTO): Promise<Tool>;
  getToolById(id: string): Promise<Tool | null>;
  getAllTools(): Promise<Tool[]>;
  updateTool(id: string, dto: UpdateToolDTO): Promise<Tool | null>;
  deleteTool(id: string): Promise<void>;
}
