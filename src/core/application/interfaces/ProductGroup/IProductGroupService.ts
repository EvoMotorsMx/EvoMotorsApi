import { ProductGroup } from "../../../domain/entities";
import {
  CreateProductGroupDTO,
  UpdateProductGroupDTO,
} from "../../dtos/ProductGroup";

export interface IProductGroupService {
  createProductGroup(dto: CreateProductGroupDTO): Promise<ProductGroup>;
  getProductGroupById(id: string): Promise<ProductGroup | null>;
  getAllProductGroups(): Promise<ProductGroup[]>;
  updateProductGroup(
    id: string,
    dto: UpdateProductGroupDTO,
  ): Promise<ProductGroup | null>;
  deleteProductGroup(id: string): Promise<void>;
}
