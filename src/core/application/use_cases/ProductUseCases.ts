import { Product } from "../../domain/entities";
import { CreateProductDTO, UpdateProductDTO } from "../dtos";
import { IProductService, IProductUseCases } from "../interfaces";

export class ProductUseCases implements IProductUseCases {
  private productService: IProductService;

  constructor(productService: IProductService) {
    this.productService = productService;
  }

  async findAllProducts(): Promise<Product[]> {
    return this.productService.getAllProducts();
  }

  async createProduct(dto: CreateProductDTO): Promise<Product | null> {
    return this.productService.createProduct(dto);
  }

  async updateProduct(
    id: string,
    dto: UpdateProductDTO,
  ): Promise<Product | null> {
    return this.productService.updateProduct(id, dto);
  }

  async getProduct(id: string): Promise<Product | null> {
    return this.productService.getProductById(id);
  }

  async removeProduct(id: string): Promise<void> {
    return this.productService.deleteProduct(id);
  }
}
