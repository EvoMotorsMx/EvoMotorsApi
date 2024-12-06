import { ProductCompatibility } from "../../../domain/entities";
import {
  CreateProductCompatibilityDTO,
  UpdateProductCompatibilityDTO,
} from "../../dtos/ProductCompatibility";

export interface IProductCompatibilityRepository {
  findById(id: string): Promise<ProductCompatibility | null>;
  findAll(): Promise<ProductCompatibility[]>;
  save(dto: CreateProductCompatibilityDTO): Promise<ProductCompatibility>;
  update(
    id: string,
    dto: UpdateProductCompatibilityDTO,
  ): Promise<ProductCompatibility>;
  deleteById(id: string): Promise<void>;
}
