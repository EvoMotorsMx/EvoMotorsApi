import { ProductCompatibility } from "../../domain/entities";
import {
  CreateProductCompatibilityDTO,
  UpdateProductCompatibilityDTO,
} from "../dtos";
import {
  IProductCompatibilityService,
  IProductCompatibilityUseCases,
} from "../interfaces";

export class ProductCompatibilityUseCases
  implements IProductCompatibilityUseCases
{
  private productCompatibilityService: IProductCompatibilityService;

  constructor(productCompatibilityService: IProductCompatibilityService) {
    this.productCompatibilityService = productCompatibilityService;
  }

  async findAllProductCompatibilities(): Promise<ProductCompatibility[]> {
    return this.productCompatibilityService.getAllProductCompatibilities();
  }

  async createProductCompatibility(
    dto: CreateProductCompatibilityDTO,
  ): Promise<ProductCompatibility> {
    return this.productCompatibilityService.createProductCompatibility(dto);
  }

  async updateProductCompatibility(
    id: string,
    dto: UpdateProductCompatibilityDTO,
  ): Promise<ProductCompatibility | null> {
    return this.productCompatibilityService.updateProductCompatibility(id, dto);
  }

  async getProductCompatibility(
    id: string,
  ): Promise<ProductCompatibility | null> {
    return this.productCompatibilityService.getProductCompatibilityById(id);
  }

  async removeProductCompatibility(id: string): Promise<void> {
    return this.productCompatibilityService.deleteProductCompatibility(id);
  }
}
