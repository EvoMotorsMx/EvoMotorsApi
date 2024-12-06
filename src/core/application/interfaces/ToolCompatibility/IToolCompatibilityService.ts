import { ToolCompatibility } from "../../../domain/entities";
import {
  CreateToolCompatibilityDTO,
  UpdateToolCompatibilityDTO,
} from "../../dtos/ToolCompatibility";

export interface IToolCompatibilityService {
  createToolCompatibility(
    dto: CreateToolCompatibilityDTO,
  ): Promise<ToolCompatibility>;
  getToolCompatibilityById(id: string): Promise<ToolCompatibility | null>;
  getAllToolCompatibilities(): Promise<ToolCompatibility[]>;
  updateToolCompatibility(
    id: string,
    dto: UpdateToolCompatibilityDTO,
  ): Promise<ToolCompatibility | null>;
  deleteToolCompatibility(id: string): Promise<void>;
}
