import { ToolAssignment } from "../../domain/entities";
import { CreateToolAssignmentDTO, UpdateToolAssignmentDTO } from "../dtos";
import {
  IToolAssignmentService,
  IToolAssignmentUseCases,
  IToolService,
} from "../interfaces";

export class ToolAssignmentUseCases implements IToolAssignmentUseCases {
  private toolAssignmentService: IToolAssignmentService;
  private toolService: IToolService;

  constructor(
    toolAssignmentService: IToolAssignmentService,
    toolService: IToolService,
  ) {
    this.toolAssignmentService = toolAssignmentService;
    this.toolService = toolService;
  }

  async findAllToolAssignments(): Promise<ToolAssignment[]> {
    return this.toolAssignmentService.getAllToolAssignments();
  }

  async createToolAssignment(
    dto: CreateToolAssignmentDTO,
  ): Promise<ToolAssignment> {
    try {
      //Get tool to see stock
      const tool = await this.toolService.getToolById(dto.tool);
      if (!tool) {
        throw new Error("Herramienta no encontrada");
      }
      if (tool.availableQuantity < 1) {
        throw new Error("No hay herramientas disponibles");
      }
      if (tool.availableQuantity - dto.assignedQuantity < 0) {
        throw new Error("No hay suficiente stock");
      }
      await this.toolService.updateTool(dto.tool, {
        totalQuantity: tool.availableQuantity - dto.assignedQuantity,
      });
      return this.toolAssignmentService.createToolAssignment(dto);
    } catch (error) {
      // Properly handling the caught error
      if (error instanceof Error) {
        throw error; // Re-throw the error if it's an instance of Error
      } else {
        // Throw a new error if the caught error is not an Error instance
        throw new Error("An unexpected error occurred");
      }
    }
  }

  async updateToolAssignment(
    id: string,
    dto: UpdateToolAssignmentDTO,
  ): Promise<ToolAssignment | null> {
    if (dto.assignedQuantity && dto.tool) {
      const tool = await this.toolService.getToolById(dto.tool);
      if (!tool) {
        throw new Error("Herramienta no encontrada");
      }
      if (tool.availableQuantity < 1) {
        throw new Error("No hay herramientas disponibles");
      }
      if (tool.availableQuantity - dto.assignedQuantity < 0) {
        throw new Error("No hay suficiente stock");
      }

      await this.toolService.updateTool(dto.tool, {
        totalQuantity: tool.availableQuantity - dto.assignedQuantity,
      });
    }
    return this.toolAssignmentService.updateToolAssignment(id, dto);
  }

  async getToolAssignment(id: string): Promise<ToolAssignment | null> {
    return this.toolAssignmentService.getToolAssignmentById(id);
  }

  async removeToolAssignment(id: string): Promise<void> {
    return this.toolAssignmentService.deleteToolAssignment(id);
  }
}
