import { ProductGroup } from "../../../domain/entities";
import {
  CreateProductGroupDTO,
  UpdateProductGroupDTO,
} from "../../dtos/ProductGroup";

export interface IProductGroupUseCases {
  createProductGroup(dto: CreateProductGroupDTO): Promise<ProductGroup>;
  updateProductGroup(
    id: string,
    dto: UpdateProductGroupDTO,
  ): Promise<ProductGroup | null>;
  getProductGroup(id: string): Promise<ProductGroup | null>;
  findAllProductGroups(): Promise<ProductGroup[]>;
  removeProductGroup(id: string): Promise<void>;
}
