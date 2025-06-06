import { Product } from "../../../domain/entities";
import { CreateProductDTO, UpdateProductDTO } from "../../dtos/Product";

export interface IProductRepository {
  findById(id: string): Promise<Product | null>;
  findAll(): Promise<Product[]>;
  save(dto: CreateProductDTO): Promise<Product | null>;
  update(id: string, dto: UpdateProductDTO): Promise<Product>;
  deleteById(id: string): Promise<void>;
}
