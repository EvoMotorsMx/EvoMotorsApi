import { Document } from "mongoose";
import ProductBrandModel, {
  ProductBrandDocument,
} from "../models/ProductBrand.model";
import { IProductBrandRepository } from "../../../core/application/interfaces";
import {
  CreateProductBrandDTO,
  UpdateProductBrandDTO,
} from "../../../core/application/dtos";
import { ProductBrand } from "../../../core/domain/entities/ProductBrand";

interface ProductBrandDoc extends Document, ProductBrandDocument {}

export class ProductBrandRepository implements IProductBrandRepository {
  async findById(id: string): Promise<ProductBrand | null> {
    const productBrandDoc = await ProductBrandModel.findById(id).exec();
    if (!productBrandDoc) return null;
    return this.docToEntity(productBrandDoc);
  }

  async findAll(): Promise<ProductBrand[]> {
    const productBrandDocs = await ProductBrandModel.find().exec();
    if (!productBrandDocs.length) return [];
    return productBrandDocs.map((doc) => this.docToEntity(doc)); // Convertir cada documento a una entidad ProductBrand
  }

  async save(dto: CreateProductBrandDTO): Promise<ProductBrand> {
    const productBrandDoc = new ProductBrandModel(dto);
    const savedProductBrandDoc = await productBrandDoc.save();
    return this.docToEntity(savedProductBrandDoc);
  }

  async update(id: string, dto: UpdateProductBrandDTO): Promise<ProductBrand> {
    const updatedProductBrandDoc = await ProductBrandModel.findByIdAndUpdate(
      id,
      dto,
      {
        new: true,
      },
    ).exec();
    if (!updatedProductBrandDoc) throw new Error("ProductBrand not found");
    return this.docToEntity(updatedProductBrandDoc);
  }

  async deleteById(id: string): Promise<void> {
    await ProductBrandModel.findByIdAndDelete(id).exec();
  }

  getQuery() {
    return ProductBrandModel.find();
  }

  private docToEntity(doc: ProductBrandDoc): ProductBrand {
    const productBrand = new ProductBrand(
      doc.name,
      undefined,
      doc.description,
      doc._id?.toString(),
    );

    return productBrand;
  }
}
