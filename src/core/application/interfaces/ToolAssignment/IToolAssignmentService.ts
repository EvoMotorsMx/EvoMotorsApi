import { ToolAssignment } from "../../../domain/entities";
import { CreateToolAssignmentDTO, UpdateToolAssignmentDTO } from "../../dtos";

export interface IToolAssignmentService {
  createToolAssignment(dto: CreateToolAssignmentDTO): Promise<ToolAssignment>;
  getToolAssignmentById(id: string): Promise<ToolAssignment | null>;
  getAllToolAssignments(): Promise<ToolAssignment[]>;
  updateToolAssignment(
    id: string,
    dto: UpdateToolAssignmentDTO,
  ): Promise<ToolAssignment | null>;
  deleteToolAssignment(id: string): Promise<void>;
}
