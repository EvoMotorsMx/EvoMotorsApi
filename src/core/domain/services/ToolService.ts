import { CreateToolDTO, UpdateToolDTO } from "../../application/dtos";
import { IToolRepository, IToolService } from "../../application/interfaces";
import { Tool } from "../entities";

export class ToolService implements IToolService {
  constructor(private toolRepository: IToolRepository) {}

  async getToolById(id: string): Promise<Tool | null> {
    return this.toolRepository.findById(id);
  }

  async getAllTools(): Promise<Tool[]> {
    return this.toolRepository.findAll();
  }

  async createTool(dto: CreateToolDTO): Promise<Tool> {
    return this.toolRepository.save(dto);
  }

  async updateTool(id: string, dto: UpdateToolDTO): Promise<Tool | null> {
    return this.toolRepository.update(id, dto);
  }

  async deleteTool(id: string): Promise<void> {
    await this.toolRepository.deleteById(id);
  }
}
