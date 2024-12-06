import { ToolCompatibility } from "../../../domain/entities";
import {
  CreateToolCompatibilityDTO,
  UpdateToolCompatibilityDTO,
} from "../../dtos/ToolCompatibility";

export interface IToolCompatibilityRepository {
  findById(id: string): Promise<ToolCompatibility | null>;
  findAll(): Promise<ToolCompatibility[]>;
  save(dto: CreateToolCompatibilityDTO): Promise<ToolCompatibility>;
  update(
    id: string,
    dto: UpdateToolCompatibilityDTO,
  ): Promise<ToolCompatibility>;
  deleteById(id: string): Promise<void>;
}
