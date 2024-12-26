import { Document } from "mongoose";
import CarModelModel, { CarModelDocument } from "../models/CarModel.model";
import BrandModel from "../models/Brand.model";
import ProductCompatibilityModel from "../models/ProductCompatibility.model";
import {
  File,
  Brand,
  CarModel,
  Product,
  ProductCompatibility,
} from "../../../core/domain/entities";
import { ICarModelRepository } from "../../../core/application/interfaces";
import {
  CreateCarModelDTO,
  UpdateCarModelDTO,
} from "../../../core/application/dtos";

interface CarModelDoc extends Document, CarModelDocument {}

export class CarModelRepository implements ICarModelRepository {
  async findById(id: string): Promise<CarModel | null> {
    const carModelDoc = await CarModelModel.findById(id)
      .populate({ path: "brandId", model: BrandModel })
      .populate({ path: "products", model: ProductCompatibilityModel })
      .exec();
    if (!carModelDoc) return null;
    return this.docToEntity(carModelDoc);
  }

  async findAll(): Promise<CarModel[]> {
    const carModelDocs = await CarModelModel.find()
      .populate({ path: "brandId", model: BrandModel })
      .populate({ path: "products", model: ProductCompatibilityModel })
      .exec();
    if (!carModelDocs.length) return [];
    return carModelDocs.map((doc) => this.docToEntity(doc)); // Convertir cada documento a una entidad Brand
  }

  async save(dto: CreateCarModelDTO): Promise<CarModel> {
    const carModelDoc = new CarModelModel(dto);
    const savedCarModelDoc = await carModelDoc.save();
    await savedCarModelDoc.populate({ path: "brandId", model: BrandModel });
    await savedCarModelDoc.populate({
      path: "products",
      model: ProductCompatibilityModel,
    });
    return this.docToEntity(savedCarModelDoc);
  }

  async update(id: string, dto: UpdateCarModelDTO): Promise<CarModel> {
    const updatedBrandDoc = await CarModelModel.findByIdAndUpdate(id, dto, {
      new: true,
    })
      .populate({ path: "brandId", model: BrandModel })
      .populate({ path: "products", model: ProductCompatibilityModel })
      .exec();
    if (!updatedBrandDoc) throw new Error("Car Model not found");
    return this.docToEntity(updatedBrandDoc);
  }

  async deleteById(id: string): Promise<void> {
    await CarModelModel.findByIdAndDelete(id).exec();
  }

  private docToEntity(doc: CarModelDoc): CarModel {
    const brand = new Brand(
      doc.brandId.name,
      doc.brandId.description,
      doc.brandId._id,
    );

    const products = doc.products?.map(
      (product) =>
        new ProductCompatibility(
          product.product,
          product.carModel,
          product._id,
        ),
    );

    const files = doc.files?.map(
      (file) => new File(file.fileUrl, file.type, file._id!),
    );

    const carModel = new CarModel(
      doc.name,
      brand,
      doc.year,
      doc.engineSize,
      doc.cylinder,
      doc.combustion,
      doc.engineType,
      files,
      products,
      doc._id?.toString(),
    );

    return carModel;
  }
}
