import { ProductBrand } from "../../../domain/entities";
import {
  CreateProductBrandDTO,
  UpdateProductBrandDTO,
} from "../../dtos/ProductBrand";

export interface IProductBrandRepository {
  findById(id: string): Promise<ProductBrand | null>;
  findAll(): Promise<ProductBrand[]>;
  save(dto: CreateProductBrandDTO): Promise<ProductBrand>;
  update(id: string, dto: UpdateProductBrandDTO): Promise<ProductBrand>;
  deleteById(id: string): Promise<void>;
  getQuery(): any;
}
