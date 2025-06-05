import {
  CreateProductCompatibilityDTO,
  UpdateProductCompatibilityDTO,
} from "../../application/dtos";
import {
  IProductCompatibilityRepository,
  IProductCompatibilityService,
} from "../../application/interfaces";
import { ProductCompatibility } from "../entities";

export class ProductCompatibilityService
  implements IProductCompatibilityService
{
  constructor(
    private productCompatibilityRepository: IProductCompatibilityRepository,
  ) {}

  async getProductCompatibilityById(
    id: string,
  ): Promise<ProductCompatibility | null> {
    return this.productCompatibilityRepository.findById(id);
  }

  async getAllProductCompatibilities(): Promise<ProductCompatibility[]> {
    return this.productCompatibilityRepository.findAll();
  }

  async createProductCompatibility(
    dto: CreateProductCompatibilityDTO,
  ): Promise<ProductCompatibility | null> {
    return this.productCompatibilityRepository.save(dto);
  }

  async updateProductCompatibility(
    id: string,
    dto: UpdateProductCompatibilityDTO,
  ): Promise<ProductCompatibility | null> {
    return this.productCompatibilityRepository.update(id, dto);
  }

  async deleteProductCompatibility(id: string): Promise<void> {
    await this.productCompatibilityRepository.deleteById(id);
  }
}
