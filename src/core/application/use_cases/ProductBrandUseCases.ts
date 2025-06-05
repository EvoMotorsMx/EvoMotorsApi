import { ProductBrand } from "../../domain/entities";
import { CreateProductBrandDTO, UpdateProductBrandDTO } from "../dtos";
import { IProductBrandService, IProductBrandUseCases } from "../interfaces";

export class ProductBrandUseCases implements IProductBrandUseCases {
  private productBrandService: IProductBrandService;

  constructor(productBrandService: IProductBrandService) {
    this.productBrandService = productBrandService;
  }

  async findAllProductBrands(): Promise<ProductBrand[]> {
    return this.productBrandService.getAllProductBrands();
  }

  async createProductBrand(dto: CreateProductBrandDTO): Promise<ProductBrand> {
    return this.productBrandService.createProductBrand(dto);
  }

  async updateProductBrand(
    id: string,
    dto: UpdateProductBrandDTO,
  ): Promise<ProductBrand | null> {
    return this.productBrandService.updateProductBrand(id, dto);
  }

  async getProductBrand(id: string): Promise<ProductBrand | null> {
    return this.productBrandService.getProductBrandById(id);
  }

  async removeProductBrand(id: string): Promise<void> {
    return this.productBrandService.deleteProductBrand(id);
  }
}
