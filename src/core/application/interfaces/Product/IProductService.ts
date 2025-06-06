import { Product } from "../../../domain/entities";
import { CreateProductDTO, UpdateProductDTO } from "../../dtos/Product";

export interface IProductService {
  createProduct(dto: CreateProductDTO): Promise<Product | null>;
  getProductById(id: string): Promise<Product | null>;
  getAllProducts(): Promise<Product[]>;
  updateProduct(id: string, dto: UpdateProductDTO): Promise<Product | null>;
  deleteProduct(id: string): Promise<void>;
}
