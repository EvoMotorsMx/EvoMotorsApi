import {
  CreateProductGroupDTO,
  UpdateProductGroupDTO,
} from "../../application/dtos";
import {
  IProductGroupRepository,
  IProductGroupService,
} from "../../application/interfaces";
import { ProductGroup } from "../entities";

export class ProductGroupService implements IProductGroupService {
  constructor(private productGroupRepository: IProductGroupRepository) {}

  async getProductGroupById(id: string): Promise<ProductGroup | null> {
    return this.productGroupRepository.findById(id);
  }

  async getAllProductGroups(): Promise<ProductGroup[]> {
    return this.productGroupRepository.findAll();
  }

  async createProductGroup(dto: CreateProductGroupDTO): Promise<ProductGroup> {
    return this.productGroupRepository.save(dto);
  }

  async updateProductGroup(
    id: string,
    dto: UpdateProductGroupDTO,
  ): Promise<ProductGroup | null> {
    return this.productGroupRepository.update(id, dto);
  }

  async deleteProductGroup(id: string): Promise<void> {
    await this.productGroupRepository.deleteById(id);
  }
}
