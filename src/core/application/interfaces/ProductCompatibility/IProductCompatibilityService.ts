import { ProductCompatibility } from "../../../domain/entities";
import {
  CreateProductCompatibilityDTO,
  UpdateProductCompatibilityDTO,
} from "../../dtos/ProductCompatibility";

export interface IProductCompatibilityService {
  createProductCompatibility(
    dto: CreateProductCompatibilityDTO,
  ): Promise<ProductCompatibility | null>;
  getProductCompatibilityById(id: string): Promise<ProductCompatibility | null>;
  getAllProductCompatibilities(): Promise<ProductCompatibility[]>;
  updateProductCompatibility(
    id: string,
    dto: UpdateProductCompatibilityDTO,
  ): Promise<ProductCompatibility | null>;
  deleteProductCompatibility(id: string): Promise<void>;
}
