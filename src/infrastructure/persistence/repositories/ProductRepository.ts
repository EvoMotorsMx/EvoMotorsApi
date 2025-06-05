import { Document } from "mongoose";
import ProductModel, { ProductDocument } from "../models/Product.model";
import { IProductRepository } from "../../../core/application/interfaces/Product/IProductRepository";
import {
  Product,
  ProductBrand,
  ProductGroup,
} from "../../../core/domain/entities";
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
    const productBrand = new ProductBrand(
      doc.productGroupId?.productBrandId?.name ?? "",
      doc.productGroupId?.productBrandId?.logo,
      doc.productGroupId?.productBrandId?.description,
      doc.productGroupId?.productBrandId?._id?.toString(),
    );

    const productGroup = new ProductGroup(
      doc.productGroupId?.name ?? "",
      productBrand,
      doc.productGroupId?.description,
      doc.productGroupId?.image,
      doc.productGroupId?._id?.toString(),
    );

    const product = new Product(
      doc.name,
      doc.type,
      productGroup,
      doc.description,
      doc.sku,
      doc.systemType,
      doc.price,
      doc.isComplement,
      doc._id?.toString(), // Convertir ObjectId a string
    );
    return product;
  }
}
