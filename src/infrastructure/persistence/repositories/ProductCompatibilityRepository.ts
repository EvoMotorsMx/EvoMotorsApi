import { Document } from "mongoose";
import ProductCompatibilityModel, {
  ProductCompatibilityDocument,
} from "../models/ProductCompatibility.model";
import ProductModel from "../models/Product.model";
import CarModelModel from "../models/CarModel.model";
import {
  Brand,
  CarModel,
  Product,
  ProductCompatibility,
  File,
} from "../../../core/domain/entities";
import {
  CreateProductCompatibilityDTO,
  UpdateProductCompatibilityDTO,
} from "../../../core/application/dtos";
import { IProductCompatibilityRepository } from "../../../core/application/interfaces";

interface ProductCompatibilityDoc
  extends Document,
    ProductCompatibilityDocument {}

export class ProductCompatibilityRepository
  implements IProductCompatibilityRepository
{
  async findById(id: string): Promise<ProductCompatibility | null> {
    const productCompatibilityDoc = await ProductCompatibilityModel.findById(id)
      .populate({ path: "product", model: ProductModel })
      .populate({ path: "carModel", model: CarModelModel })
      .exec();
    if (!productCompatibilityDoc) return null;
    return this.docToEntity(productCompatibilityDoc);
  }

  async findAll(): Promise<ProductCompatibility[]> {
    const productCompatibilityDocs = await ProductCompatibilityModel.find()
      .populate({ path: "product", model: ProductModel })
      .populate({ path: "carModel", model: CarModelModel })
      .exec();
    if (!productCompatibilityDocs.length) return [];
    return productCompatibilityDocs.map((doc) => this.docToEntity(doc));
  }

  async save(
    dto: CreateProductCompatibilityDTO,
  ): Promise<ProductCompatibility> {
    const productCompatibilityDoc = new ProductCompatibilityModel({
      product: dto.productId,
      carModel: dto.carModelId,
    });
    await productCompatibilityDoc.populate({
      path: "product",
      model: ProductModel,
    });
    await productCompatibilityDoc.populate({
      path: "carModel",
      model: CarModelModel,
    });
    const savedProductCompatibilityDoc = await productCompatibilityDoc.save();
    return this.docToEntity(savedProductCompatibilityDoc);
  }

  async update(
    id: string,
    dto: UpdateProductCompatibilityDTO,
  ): Promise<ProductCompatibility> {
    const updateData: { [key: string]: any } = {};
    if (dto.productId !== undefined) {
      updateData["product"] = dto.productId;
    }
    if (dto.carModelId !== undefined) {
      updateData["carModel"] = dto.carModelId;
    }

    if (Object.keys(updateData).length > 0) {
      const updatedProductCompatibilityDoc =
        await ProductCompatibilityModel.findByIdAndUpdate(id, updateData, {
          new: true,
        })
          .populate({ path: "product", model: ProductModel })
          .populate({ path: "carModel", model: CarModelModel })
          .exec();

      if (!updatedProductCompatibilityDoc)
        throw new Error("ProductCompatibility not found");

      return this.docToEntity(updatedProductCompatibilityDoc);
    } else {
      throw new Error("No valid fields provided for update");
    }
  }

  async deleteById(id: string): Promise<void> {
    await ProductCompatibilityModel.findByIdAndDelete(id).exec();
  }

  private docToEntity(doc: ProductCompatibilityDoc): ProductCompatibility {
    const brand = new Brand(
      doc.carModel.brandId.name,
      doc.carModel.brandId.description,
      doc.carModel.brandId._id?.toString(),
    );

    let products =
      (doc.carModel.products as ProductCompatibility[]).map(
        (product) =>
          new ProductCompatibility(
            product.product,
            product.carModel,
            product._id,
          ),
      ) ?? [];

    const files =
      (doc.carModel.files as File[]).map(
        (file) => new File(file.fileUrl, file.type, file._id!),
      ) ?? [];

    const carModel = new CarModel(
      doc.carModel.name,
      brand,
      doc.carModel.year,
      doc.carModel.engineSize,
      doc.carModel.cylinder,
      doc.carModel.combustion,
      doc.carModel.engineType,
      files,
      products,
      doc.carModel._id?.toString(),
    );

    const product = new Product(
      doc.product.name,
      doc.product?.description,
      doc._id?.toString(),
    );

    const productCompatibility = new ProductCompatibility(
      product,
      carModel,
      doc._id?.toString(),
    );

    return productCompatibility;
  }
}
