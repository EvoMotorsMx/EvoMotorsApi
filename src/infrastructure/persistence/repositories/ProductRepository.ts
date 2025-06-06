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
import ProductGroupModel from "../models/ProductGroup.model";
import ProductBrandModel from "../models/ProductBrand.model";

interface ProductDoc extends Document, ProductDocument {}

export class ProductRepository implements IProductRepository {
  async findById(id: string): Promise<Product | null> {
    const productDoc = await ProductModel.findById(id)
      .populate({
        path: "productGroupId",
        model: ProductGroupModel,
        populate: [{ path: "productBrandId", model: ProductBrandModel }],
      })
      .exec();
    if (!productDoc) return null;
    return this.docToEntity(productDoc);
  }

  async findAll(): Promise<Product[]> {
    const productDocs = await ProductModel.find()
      .populate({
        path: "productGroupId",
        model: ProductGroupModel,
        populate: [{ path: "productBrandId", model: ProductBrandModel }],
      })
      .exec();
    if (!productDocs.length) return [];
    return productDocs.map((doc) => this.docToEntity(doc)); // Convertir cada documento a una entidad Product
  }

  async save(dto: CreateProductDTO): Promise<Product | null> {
    const productDoc = new ProductModel(dto);
    const savedProductDoc = await productDoc.save();

    const populatedProductDoc = await ProductModel.findById(savedProductDoc._id)
      .populate({
        path: "productGroupId",
        model: ProductGroupModel,
        populate: [{ path: "productBrandId", model: ProductBrandModel }],
      })
      .exec();

    if (!populatedProductDoc) {
      return null;
    }

    return this.docToEntity(populatedProductDoc);
  }

  async update(id: string, dto: UpdateProductDTO): Promise<Product> {
    const updatedProductDoc = await ProductModel.findByIdAndUpdate(id, dto, {
      new: true,
    })
      .populate({
        path: "productGroupId",
        model: ProductGroupModel,
        populate: [{ path: "productBrandId", model: ProductBrandModel }],
      })
      .exec();
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
