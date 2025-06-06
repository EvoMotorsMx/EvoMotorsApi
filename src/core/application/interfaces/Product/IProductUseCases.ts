import { Product } from "../../../domain/entities";
import { CreateProductDTO, UpdateProductDTO } from "../../dtos/Product";

export interface IProductUseCases {
  createProduct(dto: CreateProductDTO): Promise<Product | null>;
  updateProduct(id: string, dto: UpdateProductDTO): Promise<Product | null>;
  getProduct(id: string): Promise<Product | null>;
  findAllProducts(): Promise<Product[]>;
  removeProduct(id: string): Promise<void>;
}
