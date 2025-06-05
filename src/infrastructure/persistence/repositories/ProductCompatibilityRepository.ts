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
  ProductBrand,
  ProductGroup,
} from "../../../core/domain/entities";
import {
  CreateProductCompatibilityDTO,
  UpdateProductCompatibilityDTO,
} from "../../../core/application/dtos";
import { IProductCompatibilityRepository } from "../../../core/application/interfaces";
import { ProductType } from "../../../shared/enums";

interface ProductCompatibilityDoc
  extends Document,
    ProductCompatibilityDocument {}

export class ProductCompatibilityRepository
  implements IProductCompatibilityRepository
{
  async findById(id: string): Promise<ProductCompatibility | null> {
    const productCompatibilityDoc = await ProductCompatibilityModel.findById(id)
      .populate({
        path: "product",
        model: ProductModel,
        populate: {
          path: "productGroupId",
          model: "ProductGroup",
          populate: { path: "productBrandId", model: "ProductBrand" },
        },
      })
      .populate({
        path: "carModel",
        model: CarModelModel,
        populate: { path: "brandId", model: "Brand" },
      })
      .populate({
        path: "complementId",
        model: ProductModel,
        populate: {
          path: "productGroupId",
          model: "ProductGroup",
          populate: { path: "productBrandId", model: "ProductBrand" },
        },
      })
      .exec();
    if (!productCompatibilityDoc) return null;
    return this.docToEntity(productCompatibilityDoc);
  }

  async findAll(): Promise<ProductCompatibility[]> {
    const productCompatibilityDocs = await ProductCompatibilityModel.find()
      .populate({
        path: "product",
        model: ProductModel,
        populate: {
          path: "productGroupId",
          model: "ProductGroup",
          populate: { path: "productBrandId", model: "ProductBrand" },
        },
      })
      .populate({
        path: "carModel",
        model: CarModelModel,
        populate: { path: "brandId", model: "Brand" },
      })
      .populate({
        path: "complementId",
        model: ProductModel,
        populate: {
          path: "productGroupId",
          model: "ProductGroup",
          populate: { path: "productBrandId", model: "ProductBrand" },
        },
      })
      .exec();
    if (!productCompatibilityDocs.length) return [];
    return productCompatibilityDocs.map((doc) => this.docToEntity(doc));
  }

  async save(
    dto: CreateProductCompatibilityDTO,
  ): Promise<ProductCompatibility | null> {
    const productCompatibilityDoc = new ProductCompatibilityModel(dto);

    const savedProductCompatibilityDoc = await productCompatibilityDoc.save();

    const populatedProductCompatibilityDoc =
      await ProductCompatibilityModel.findById(savedProductCompatibilityDoc._id)
        .populate({
          path: "productId",
          model: ProductModel,
          populate: {
            path: "productGroupId",
            model: "ProductGroup",
            populate: { path: "productBrandId", model: "ProductBrand" },
          },
        })
        .populate({
          path: "carModelId",
          model: CarModelModel,
          populate: { path: "brandId", model: "Brand" },
        })
        .populate({
          path: "complementId",
          model: ProductModel,
          populate: {
            path: "productGroupId",
            model: "ProductGroup",
            populate: { path: "productBrandId", model: "ProductBrand" },
          },
        })
        .exec();

    if (!populatedProductCompatibilityDoc) {
      return null;
    }

    return this.docToEntity(populatedProductCompatibilityDoc);
  }

  async update(
    id: string,
    dto: UpdateProductCompatibilityDTO,
  ): Promise<ProductCompatibility> {
    const updateData: { [key: string]: any } = {};

    if (Object.keys(updateData).length > 0) {
      const updatedProductCompatibilityDoc =
        await ProductCompatibilityModel.findByIdAndUpdate(id, updateData, {
          new: true,
        })
          .populate({
            path: "product",
            model: ProductModel,
            populate: {
              path: "productGroupId",
              model: "ProductGroup",
              populate: { path: "productBrandId", model: "ProductBrand" },
            },
          })
          .populate({
            path: "carModel",
            model: CarModelModel,
            populate: { path: "brandId", model: "Brand" },
          })
          .populate({
            path: "complementId",
            model: ProductModel,
            populate: {
              path: "productGroupId",
              model: "ProductGroup",
              populate: { path: "productBrandId", model: "ProductBrand" },
            },
          })
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

  getQuery() {
    return ProductCompatibilityModel.find();
  }

  private docToEntity(doc: ProductCompatibilityDoc): ProductCompatibility {
    const brand = new Brand(
      doc.carModelId.brandId.name,
      doc.carModelId.brandId.description,
      doc.carModelId.brandId._id?.toString(),
    );

    const files =
      (doc.carModelId.files as File[]).map(
        (file) => new File(file.fileUrl, file.type, file._id!),
      ) ?? [];

    const carModel = new CarModel(
      doc.carModelId.name,
      brand,
      doc.carModelId.year,
      doc.carModelId.engineSize,
      doc.carModelId.cylinder,
      doc.carModelId.combustion,
      doc.carModelId.engineType,
      doc.carModelId.originalHp,
      doc.carModelId.originalTorque,
      doc.carModelId.topSpeed,
      files,
      doc.carModelId.isActive,
      doc.carModelId._id?.toString(),
    );

    const productBrand = new ProductBrand(
      doc.productId.productGroupId?.productBrandId?.name ?? "",
      doc.productId.productGroupId?.productBrandId?.logo,
      doc.productId.productGroupId?.productBrandId?.description,
      doc.productId.productGroupId?.productBrandId?._id?.toString(),
    );

    const productGroup = new ProductGroup(
      doc.productId.productGroupId?.name ?? "",
      productBrand,
      doc.productId.productGroupId?.description,
      doc.productId.productGroupId?.image,
      doc.productId.productGroupId?._id?.toString(),
    );

    const product = new Product(
      doc.productId.name,
      doc.productId.type,
      productGroup,
      doc.productId?.description,
      doc.productId?.sku,
      doc.productId?.systemType,
      doc.productId?.price,
      doc.productId?.isComplement,
      doc.productId?._id?.toString(),
    );

    //complement
    let complement: Product | undefined = undefined;
    let groupComplement: ProductGroup | undefined = undefined;
    let brandComplement: ProductBrand | undefined = undefined;
    if (doc.complementId) {
      brandComplement = new ProductBrand(
        doc.complementId?.productGroupId?.productBrandId?.name ?? "",
        doc.complementId?.productGroupId?.productBrandId?.logo,
        doc.complementId?.productGroupId?.productBrandId?.description,
        doc.complementId?.productGroupId?.productBrandId?._id?.toString(),
      );

      groupComplement = new ProductGroup(
        doc.complementId?.productGroupId?.name ?? "",
        brandComplement,
        doc.complementId?.productGroupId?.description,
        doc.complementId?.productGroupId?.image,
        doc.complementId?.productGroupId?._id?.toString(),
      );

      complement = new Product(
        doc.complementId?.name ?? "",
        doc.complementId?.type ?? ProductType.CABLE,
        groupComplement,
        doc.complementId?.description,
        doc.complementId?.sku,
        doc.complementId?.systemType,
        doc.complementId?.price,
        doc.complementId?.isComplement,
        doc.complementId?._id?.toString(),
      );
    }

    const productCompatibility = new ProductCompatibility(
      product,
      carModel,
      doc.endHp,
      doc.endTorque,
      doc.vMax,
      doc.priceOverride,
      doc.priceAdditional,
      doc.notes,
      doc.description,
      complement,
      doc._id?.toString(),
    );

    return productCompatibility;
  }
}
