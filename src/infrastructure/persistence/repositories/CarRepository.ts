import { Document } from "mongoose";
import CarModel, { CarDocument } from "../models/Car.model";
import CarModelModel from "../models/CarModel.model";
import BrandModel from "../models/Brand.model";
import WitnessModel from "../models/Witness.model";
import RemissionModel from "../models/Remission.model";
import CertificateModel from "../models/Certificate.model";
import {
  Brand,
  Car,
  CarModel as CarModelEntity,
  Certificate,
  Remission,
  Witness,
} from "../../../core/domain/entities";
import { ICarRepository } from "../../../core/application/interfaces";
import { CreateCarDTO, UpdateCarDTO } from "../../../core/application/dtos";

interface CarDoc extends Document, CarDocument {}

export class CarRepository implements ICarRepository {
  async findById(id: string): Promise<Car | null> {
    const carModelDoc = await CarModel.findById(id)
      .populate({
        path: "carModelId",
        model: CarModelModel,
        populate: { path: "brandId", model: BrandModel },
      })
      .populate({
        path: "witnessId",
        model: WitnessModel,
      })
      .populate({
        path: "Remission",
        model: RemissionModel,
      })
      .populate({
        path: "Certificate",
        model: CertificateModel,
      })
      .exec();
    if (!carModelDoc) return null;
    return this.docToEntity(carModelDoc);
  }

  async findAll(): Promise<Car[]> {
    const carModelDocs = await CarModel.find()
      .populate({
        path: "carModelId",
        model: CarModelModel,
        populate: { path: "brandId", model: BrandModel },
      })
      .populate({
        path: "witnessId",
        model: WitnessModel,
      })
      .populate({
        path: "Remission",
        model: RemissionModel,
      })
      .populate({
        path: "Certificate",
        model: CertificateModel,
      })
      .exec();
    if (!carModelDocs.length) return [];
    return carModelDocs.map((doc) => this.docToEntity(doc));
  }

  async save(dto: CreateCarDTO): Promise<Car | null> {
    const carModelDoc = new CarModel(dto);
    const savedCarDoc = await carModelDoc.save();
    const populatedCarDoc = await CarModel.findById(savedCarDoc._id)
      .populate({
        path: "carModelId",
        model: CarModelModel,
        populate: {
          path: "brandId",
          model: BrandModel,
        },
      })
      .populate({
        path: "witnessId",
        model: WitnessModel,
      })
      .populate({
        path: "Remission",
        model: RemissionModel,
      })
      .populate({
        path: "Certificate",
        model: CertificateModel,
      })
      .exec();

    if (!populatedCarDoc) {
      return null;
    }

    return this.docToEntity(populatedCarDoc);
  }

  async update(id: string, dto: UpdateCarDTO): Promise<Car> {
    const updatedBrandDoc = await CarModel.findByIdAndUpdate(id, dto, {
      new: true,
    })
      .populate({
        path: "carModelId",
        model: CarModelModel,
        populate: {
          path: "brandId",
          model: BrandModel,
        },
      })
      .populate({
        path: "witnessId",
        model: WitnessModel,
      })
      .populate({
        path: "Remission",
        model: RemissionModel,
      })
      .populate({
        path: "Certificate",
        model: CertificateModel,
      })
      .exec();
    if (!updatedBrandDoc) throw new Error("Car Model not found");
    return this.docToEntity(updatedBrandDoc);
  }

  async deleteById(id: string): Promise<void> {
    await CarModel.findByIdAndDelete(id).exec();
  }

  private docToEntity(doc: CarDoc): Car {
    const brand = new Brand(
      doc.carModelId.brandId.name,
      doc.carModelId.brandId.description,
      doc.carModelId.brandId._id,
    );

    const carModel = new CarModelEntity(
      doc.carModelId.name,
      brand,
      doc.carModelId.year,
      doc.carModelId.engineSize,
      doc.carModelId.cylinder,
      doc.carModelId.combustion,
      doc.carModelId.engineType,
      [],
      doc.carModelId._id,
    );

    const certificate = new Certificate(
      doc.certificateId.name,
      doc.id,
      doc.certificateId._id,
    );

    const remissions = doc.remissions?.map(
      (remission) => new Remission(remission.name, remission._id),
    );

    const witnesses = doc.witnesses?.map(
      (witness) => new Witness(witness.name, witness.description, witness._id),
    );

    const car = new Car(
      doc.mileage,
      doc.tankStatus,
      doc.damageImageUrl,
      doc.damageStatusDescription,
      doc.scannerDescription,
      doc.vin,
      doc.plates,
      doc.leadId,
      carModel,
      certificate,
      remissions,
      witnesses,
      doc.id,
    );

    return car;
  }
}
