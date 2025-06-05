import { ProductBrand } from "../../../domain/entities";
import {
  CreateProductBrandDTO,
  UpdateProductBrandDTO,
} from "../../dtos/ProductBrand";

export interface IProductBrandService {
  createProductBrand(dto: CreateProductBrandDTO): Promise<ProductBrand>;
  getProductBrandById(id: string): Promise<ProductBrand | null>;
  getAllProductBrands(): Promise<ProductBrand[]>;
  updateProductBrand(
    id: string,
    dto: UpdateProductBrandDTO,
  ): Promise<ProductBrand | null>;
  deleteProductBrand(id: string): Promise<void>;
}
