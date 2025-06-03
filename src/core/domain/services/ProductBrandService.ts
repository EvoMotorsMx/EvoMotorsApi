import {
  CreateProductBrandDTO,
  UpdateProductBrandDTO,
} from "../../application/dtos";
import {
  IProductBrandRepository,
  IProductBrandService,
} from "../../application/interfaces";
import { ProductBrand } from "../entities";

export class ProductBrandService implements IProductBrandService {
  constructor(private productBrandRepository: IProductBrandRepository) {}

  async getProductBrandById(id: string): Promise<ProductBrand | null> {
    return this.productBrandRepository.findById(id);
  }

  async getAllProductBrands(): Promise<ProductBrand[]> {
    return this.productBrandRepository.findAll();
  }

  async createProductBrand(dto: CreateProductBrandDTO): Promise<ProductBrand> {
    return this.productBrandRepository.save(dto);
  }

  async updateProductBrand(
    id: string,
    dto: UpdateProductBrandDTO,
  ): Promise<ProductBrand | null> {
    return this.productBrandRepository.update(id, dto);
  }

  async deleteProductBrand(id: string): Promise<void> {
    await this.productBrandRepository.deleteById(id);
  }
}
