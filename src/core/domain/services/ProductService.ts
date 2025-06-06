import { CreateProductDTO, UpdateProductDTO } from "../../application/dtos";
import {
  IProductRepository,
  IProductService,
} from "../../application/interfaces";
import { Product } from "../entities";

export class ProductService implements IProductService {
  constructor(private productRepository: IProductRepository) {}

  async getProductById(id: string): Promise<Product | null> {
    return this.productRepository.findById(id);
  }

  async getAllProducts(): Promise<Product[]> {
    return this.productRepository.findAll();
  }

  async createProduct(dto: CreateProductDTO): Promise<Product | null> {
    return this.productRepository.save(dto);
  }

  async updateProduct(
    id: string,
    dto: UpdateProductDTO,
  ): Promise<Product | null> {
    return this.productRepository.update(id, dto);
  }

  async deleteProduct(id: string): Promise<void> {
    await this.productRepository.deleteById(id);
  }
}
