import { Document } from "mongoose";
import ProductPriceModel, {
  ProductPriceDocument,
} from "../models/ProductPrice.model";
import CarModelModel from "../models/CarModel.model";
import ProductModel from "../models/Product.model";
import {
  ProductPrice,
  CarModel,
  Brand,
  Product,
} from "../../../core/domain/entities";
import { IProductPriceRepository } from "../../../core/application/interfaces";
import {
  CreateProductPriceDTO,
  UpdateProductPriceDTO,
} from "../../../core/application/dtos";

interface ProductPriceDoc extends Document, ProductPriceDocument {}

export class ProductPriceRepository implements IProductPriceRepository {
  async findById(id: string): Promise<ProductPrice | null> {
    const productPriceDoc = await ProductPriceModel.findById(id)
      .populate({ path: "carModelId", model: CarModelModel })
      .populate({ path: "productId", model: ProductModel })
      .exec();
    if (!productPriceDoc) return null;
    return this.docToEntity(productPriceDoc);
  }

  async findAll(): Promise<ProductPrice[]> {
    const productPriceDocs = await ProductPriceModel.find()
      .populate({ path: "carModelId", model: CarModelModel })
      .populate({ path: "productId", model: ProductModel })
      .exec();
    if (!productPriceDocs.length) return [];
    return productPriceDocs.map((doc) => this.docToEntity(doc)); // Convertir cada documento a una entidad Brand
  }

  async save(dto: CreateProductPriceDTO): Promise<ProductPrice> {
    const productPriceDoc = new ProductPriceModel(dto);
    const savedProductPriceDoc = await productPriceDoc.save();
    const populatedCarModelDoc = await savedProductPriceDoc.populate({
      path: "carModelId",
      model: CarModelModel,
    });
    const populatedProductModelDoc = await populatedCarModelDoc.populate({
      path: "productId",
      model: ProductModel,
    });
    return this.docToEntity(populatedProductModelDoc);
  }

  async update(id: string, dto: UpdateProductPriceDTO): Promise<ProductPrice> {
    const updatedBrandDoc = await ProductPriceModel.findByIdAndUpdate(id, dto, {
      new: true,
    })
      .populate({ path: "carModelId", model: CarModelModel })
      .populate({ path: "productId", model: ProductModel })
      .exec();
    if (!updatedBrandDoc) throw new Error("Car Model not found");
    return this.docToEntity(updatedBrandDoc);
  }

  async deleteById(id: string): Promise<void> {
    await ProductPriceModel.findByIdAndDelete(id).exec();
  }

  private docToEntity(doc: ProductPriceDoc): ProductPrice {
    const brand = new Brand(
      doc.carModelId.brandId.name,
      doc.carModelId.brandId.description,
      doc.carModelId.brandId._id,
    );
    const carModel = new CarModel(
      doc.carModelId.name,
      brand,
      doc.carModelId.year,
      doc.carModelId.engineSize,
      doc.carModelId.cylinder,
      doc.carModelId.combustion,
      doc.carModelId.engineType,
      doc.carModelId.files,
      doc.carModelId._id,
    );

    const product = new Product(
      doc.productId.name,
      doc.productId.description,
      doc.productId._id,
    );

    const productPrice = new ProductPrice(carModel, product, doc._id);
    return productPrice;
  }
}
