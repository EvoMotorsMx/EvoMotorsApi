import { Document } from "mongoose";
import ProductModel, { ProductDocument } from "../models/Product.model";
import { IProductRepository } from "../../../core/application/interfaces/Product/IProductRepository";
import { Product, ProductGroup } from "../../../core/domain/entities";
import {
  CreateProductDTO,
  UpdateProductDTO,
} from "../../../core/application/dtos";

interface ProductDoc extends Document, ProductDocument {}

export class ProductRepository implements IProductRepository {
  async findById(id: string): Promise<Product | null> {
    const productDoc = await ProductModel.findById(id).exec();
    if (!productDoc) return null;
    return this.docToEntity(productDoc);
  }

  async findAll(): Promise<Product[]> {
    const productDocs = await ProductModel.find().exec();
    if (!productDocs.length) return [];
    return productDocs.map((doc) => this.docToEntity(doc)); // Convertir cada documento a una entidad Product
  }

  async save(dto: CreateProductDTO): Promise<Product> {
    const productDoc = new ProductModel(dto);
    const savedProductDoc = await productDoc.save();
    return this.docToEntity(savedProductDoc);
  }

  async update(id: string, dto: UpdateProductDTO): Promise<Product> {
    const updatedProductDoc = await ProductModel.findByIdAndUpdate(id, dto, {
      new: true,
    }).exec();
    if (!updatedProductDoc) throw new Error("Product not found");
    return this.docToEntity(updatedProductDoc);
  }

  async deleteById(id: string): Promise<void> {
    await ProductModel.findByIdAndDelete(id).exec();
  }

  getQuery() {
    return ProductModel.find();
  }

  private docToEntity(doc: ProductDoc): Product {
    let productComplement: Product | null = null;
    if (doc.complementId?._id?.toString()) {
      if (doc.complementId.productGroupId) {
        if (doc.complementId.productGroupId.productBrandId) {
          const productBrandId = doc.complementId.productGroupId;
        }
        /*         const complementProductGroup = new ProductGroup(
          doc.complementId?.productGroupId?.name,
          undefined,
          doc.complementId?.productGroupId?.description,
          doc.complementId.productGroupId?.image,
          doc.complementId.productGroupId?.productBrandId?._id?.toString(),
        ); */
      }

      const productComplement = new Product(
        doc.complementId?.name,
        doc.complementId?.type,
        doc.complementId?.description,
        doc.complementId?.sku,
        doc.complementId?.productGroupId,
        doc.complementId?.systemType,
        doc.complementId?.stock, // Convertir ObjectId a string
      );
    }

    const product = new Product(
      doc.name,
      doc.type,
      doc.description,
      doc.sku,
      undefined, //Product Group Id
      doc.systemType,
      doc.stock,
      doc.price,
      doc.isComplement,
      productComplement ?? null,
      doc._id?.toString(), // Convertir ObjectId a string
    );
    return product;
  }
}
