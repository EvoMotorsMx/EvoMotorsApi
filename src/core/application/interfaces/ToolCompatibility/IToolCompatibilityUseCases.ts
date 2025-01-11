import { ToolCompatibility } from "../../../domain/entities";
import {
  CreateToolCompatibilityDTO,
  UpdateToolCompatibilityDTO,
} from "../../dtos/ToolCompatibility";

export interface IToolCompatibilityUseCases {
  createToolCompatibility(
    dto: CreateToolCompatibilityDTO,
  ): Promise<ToolCompatibility>;
  updateToolCompatibility(
    id: string,
    dto: UpdateToolCompatibilityDTO,
  ): Promise<ToolCompatibility | null>;
  getToolCompatibility(id: string): Promise<ToolCompatibility | null>;
  findAllToolCompatibilities(): Promise<ToolCompatibility[]>;
  removeToolCompatibility(id: string): Promise<void>;
}
