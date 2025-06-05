import { ProductCompatibility } from "../../../domain/entities";
import {
  CreateProductCompatibilityDTO,
  UpdateProductCompatibilityDTO,
} from "../../dtos/ProductCompatibility";

export interface IProductCompatibilityUseCases {
  createProductCompatibility(
    dto: CreateProductCompatibilityDTO,
  ): Promise<ProductCompatibility | null>;
  updateProductCompatibility(
    id: string,
    dto: UpdateProductCompatibilityDTO,
  ): Promise<ProductCompatibility | null>;
  getProductCompatibility(id: string): Promise<ProductCompatibility | null>;
  findAllProductCompatibilities(): Promise<ProductCompatibility[]>;
  removeProductCompatibility(id: string): Promise<void>;
}
