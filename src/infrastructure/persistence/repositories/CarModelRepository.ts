import { Document } from "mongoose";
import { CarModel } from "../../../core/domain/entities/CarModel";
import CarModelModel, { CarModelDocument } from "../models/CarModel.model";
import BrandModel, { BrandDocument } from "../models/Brand.model";
import { ICarModelRepository } from "../../../core/application/interfaces/CarModel/ICarModelRepository";
import {
  CreateCarModelDTO,
  UpdateCarModelDTO,
} from "../../../core/application/dtos/CarModel";
import { File, Brand } from "../../../core/domain/entities";

interface CarModelDoc extends Document, CarModelDocument {}

export class CarModelRepository implements ICarModelRepository {
  async findById(id: string): Promise<CarModel | null> {
    const carModelDoc = await CarModelModel.findById(id)
      .populate({ path: "brandId", model: BrandModel })
      .exec();
    if (!carModelDoc) return null;
    return this.docToEntity(carModelDoc);
  }

  async findAll(): Promise<CarModel[]> {
    const carModelDocs = await CarModelModel.find()
      .populate({ path: "brandId", model: BrandModel })
      .exec();
    if (!carModelDocs.length) return [];
    return carModelDocs.map((doc) => this.docToEntity(doc)); // Convertir cada documento a una entidad Brand
  }

  async save(dto: CreateCarModelDTO): Promise<CarModel> {
    const carModelDoc = new CarModelModel(dto);
    const savedCarModelDoc = await carModelDoc.save();
    const populatedCarModelDoc = await savedCarModelDoc.populate({
      path: "brandId",
      model: BrandModel,
    });
    return this.docToEntity(populatedCarModelDoc);
  }

  async update(id: string, dto: UpdateCarModelDTO): Promise<CarModel> {
    const updatedBrandDoc = await CarModelModel.findByIdAndUpdate(id, dto, {
      new: true,
    })
      .populate({ path: "brandId", model: BrandModel })
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
      doc._id.toString(),
    );
    return carModel;
  }
}
