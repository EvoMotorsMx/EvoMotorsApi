import { ToolAssignment } from "../../../domain/entities";
import { CreateToolAssignmentDTO, UpdateToolAssignmentDTO } from "../../dtos";

export interface IToolAssignmentRepository {
  findById(id: string): Promise<ToolAssignment | null>;
  findAll(): Promise<ToolAssignment[]>;
  save(dto: CreateToolAssignmentDTO): Promise<ToolAssignment>;
  update(id: string, dto: UpdateToolAssignmentDTO): Promise<ToolAssignment>;
  deleteById(id: string): Promise<void>;
}
