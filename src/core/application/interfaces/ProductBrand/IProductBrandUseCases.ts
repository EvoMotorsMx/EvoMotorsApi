import { ProductBrand } from "../../../domain/entities";
import {
  CreateProductBrandDTO,
  UpdateProductBrandDTO,
} from "../../dtos/ProductBrand";

export interface IProductBrandUseCases {
  createProductBrand(dto: CreateProductBrandDTO): Promise<ProductBrand>;
  updateProductBrand(
    id: string,
    dto: UpdateProductBrandDTO,
  ): Promise<ProductBrand | null>;
  getProductBrand(id: string): Promise<ProductBrand | null>;
  findAllProductBrands(): Promise<ProductBrand[]>;
  removeProductBrand(id: string): Promise<void>;
}
