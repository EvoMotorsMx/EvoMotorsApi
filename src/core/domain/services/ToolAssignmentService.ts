import {
  CreateToolAssignmentDTO,
  UpdateToolAssignmentDTO,
} from "../../application/dtos";
import {
  IToolAssignmentRepository,
  IToolAssignmentService,
} from "../../application/interfaces";
import { ToolAssignment } from "../entities";

export class ToolAssignmentService implements IToolAssignmentService {
  constructor(private toolAssignmentRepository: IToolAssignmentRepository) {}

  async getToolAssignmentById(id: string): Promise<ToolAssignment | null> {
    return this.toolAssignmentRepository.findById(id);
  }

  async getAllToolAssignments(): Promise<ToolAssignment[]> {
    return this.toolAssignmentRepository.findAll();
  }

  async createToolAssignment(
    dto: CreateToolAssignmentDTO,
  ): Promise<ToolAssignment> {
    return this.toolAssignmentRepository.save(dto);
  }

  async updateToolAssignment(
    id: string,
    dto: UpdateToolAssignmentDTO,
  ): Promise<ToolAssignment | null> {
    return this.toolAssignmentRepository.update(id, dto);
  }

  async deleteToolAssignment(id: string): Promise<void> {
    await this.toolAssignmentRepository.deleteById(id);
  }
}
