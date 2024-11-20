import { Tool } from "../../domain/entities";
import { CreateToolDTO, UpdateToolDTO } from "../dtos";
import { IToolService, IToolUseCases } from "../interfaces";

export class ToolUseCases implements IToolUseCases {
  private toolService: IToolService;

  constructor(toolService: IToolService) {
    this.toolService = toolService;
  }

  async findAllTools(): Promise<Tool[]> {
    return this.toolService.getAllTools();
  }

  async createTool(dto: CreateToolDTO): Promise<Tool> {
    return this.toolService.createTool(dto);
  }

  async updateTool(id: string, dto: UpdateToolDTO): Promise<Tool | null> {
    return this.toolService.updateTool(id, dto);
  }

  async getTool(id: string): Promise<Tool | null> {
    return this.toolService.getToolById(id);
  }

  async removeTool(id: string): Promise<void> {
    return this.toolService.deleteTool(id);
  }
}
