import { Document } from "mongoose";
import ProductGroupModel, {
  ProductGroupDocument,
} from "../models/ProductGroup.model";
import { IProductGroupRepository } from "../../../core/application/interfaces/ProductGroup/IProductGroupRepository";
import { ProductBrand, ProductGroup } from "../../../core/domain/entities";
import {
  CreateProductGroupDTO,
  UpdateProductGroupDTO,
} from "../../../core/application/dtos";
import PoductBrandModel from "../models/ProductBrand.model";

interface ProductGroupDoc extends Document, ProductGroupDocument {}

export class ProductGroupRepository implements IProductGroupRepository {
  async findById(id: string): Promise<ProductGroup | null> {
    const productGroupDoc = await ProductGroupModel.findById(id)
      .populate({ path: "productBrandId", model: PoductBrandModel })
      .exec();
    if (!productGroupDoc) return null;
    return this.docToEntity(productGroupDoc);
  }

  async findAll(): Promise<ProductGroup[]> {
    const productGroupDocs = await ProductGroupModel.find()
      .populate({ path: "productBrandId", model: PoductBrandModel })
      .exec();
    if (!productGroupDocs.length) return [];
    return productGroupDocs.map((doc) => this.docToEntity(doc)); // Convertir cada documento a una entidad ProductGroup
  }

  async save(dto: CreateProductGroupDTO): Promise<ProductGroup> {
    const productGroupDoc = new ProductGroupModel(dto);
    const savedProductGroupDoc = await productGroupDoc.save();
    await savedProductGroupDoc.populate({
      path: "productBrandId",
      model: PoductBrandModel,
    });
    return this.docToEntity(savedProductGroupDoc);
  }

  async update(id: string, dto: UpdateProductGroupDTO): Promise<ProductGroup> {
    const updatedProductGroupDoc = await ProductGroupModel.findByIdAndUpdate(
      id,
      dto,
      {
        new: true,
      },
    )
      .populate({ path: "productBrandId", model: PoductBrandModel })
      .exec();
    if (!updatedProductGroupDoc) throw new Error("ProductGroup not found");
    return this.docToEntity(updatedProductGroupDoc);
  }

  async deleteById(id: string): Promise<void> {
    await ProductGroupModel.findByIdAndDelete(id).exec();
  }

  getQuery() {
    return ProductGroupModel.find();
  }

  private docToEntity(doc: ProductGroupDoc): ProductGroup {
    const productBrand = new ProductBrand(
      doc.productBrandId?.name,
      doc.productBrandId?.logo,
      doc.productBrandId?.description,
      doc.productBrandId?._id?.toString(),
    );

    const productGroup = new ProductGroup(
      doc.name,
      productBrand,
      doc.description,
      doc.image,
      doc._id?.toString(),
    );

    return productGroup;
  }
}
