import { ProductGroup } from "../../../domain/entities";
import {
  CreateProductGroupDTO,
  UpdateProductGroupDTO,
} from "../../dtos/ProductGroup";

export interface IProductGroupRepository {
  findById(id: string): Promise<ProductGroup | null>;
  findAll(): Promise<ProductGroup[]>;
  save(dto: CreateProductGroupDTO): Promise<ProductGroup>;
  update(id: string, dto: UpdateProductGroupDTO): Promise<ProductGroup>;
  deleteById(id: string): Promise<void>;
  getQuery(): any;
}
