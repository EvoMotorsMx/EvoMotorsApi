import { ProductGroup } from "../../domain/entities";
import { CreateProductGroupDTO, UpdateProductGroupDTO } from "../dtos";
import { IProductGroupService, IProductGroupUseCases } from "../interfaces";

export class ProductGroupUseCases implements IProductGroupUseCases {
  private productGroupService: IProductGroupService;

  constructor(productGroupService: IProductGroupService) {
    this.productGroupService = productGroupService;
  }

  async findAllProductGroups(): Promise<ProductGroup[]> {
    return this.productGroupService.getAllProductGroups();
  }

  async createProductGroup(dto: CreateProductGroupDTO): Promise<ProductGroup> {
    return this.productGroupService.createProductGroup(dto);
  }

  async updateProductGroup(
    id: string,
    dto: UpdateProductGroupDTO,
  ): Promise<ProductGroup | null> {
    return this.productGroupService.updateProductGroup(id, dto);
  }

  async getProductGroup(id: string): Promise<ProductGroup | null> {
    return this.productGroupService.getProductGroupById(id);
  }

  async removeProductGroup(id: string): Promise<void> {
    return this.productGroupService.deleteProductGroup(id);
  }
}
