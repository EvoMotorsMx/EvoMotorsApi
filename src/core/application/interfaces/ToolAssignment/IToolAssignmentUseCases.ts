import { ToolAssignment } from "../../../domain/entities";
import {
  CreateToolAssignmentDTO,
  UpdateToolAssignmentDTO,
} from "../../dtos/ToolAssignment";

export interface IToolAssignmentUseCases {
  createToolAssignment(dto: CreateToolAssignmentDTO): Promise<ToolAssignment>;
  updateToolAssignment(
    id: string,
    dto: UpdateToolAssignmentDTO,
  ): Promise<ToolAssignment | null>;
  getToolAssignment(id: string): Promise<ToolAssignment | null>;
  findAllToolAssignments(): Promise<ToolAssignment[]>;
  removeToolAssignment(id: string): Promise<void>;
}
