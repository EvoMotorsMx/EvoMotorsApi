import { Document } from "mongoose";
import CarModel, { CarDocument } from "../models/Car.model";
import CarModelModel from "../models/CarModel.model";
import BrandModel from "../models/Brand.model";
import CertificateModel from "../models/Certificate.model";
import CustomerModel from "../models/Customer.model";
import {
  Brand,
  Car,
  CarModel as CarModelEntity,
  Customer,
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
        populate: [{ path: "brandId", model: BrandModel }],
      })
      .populate({
        path: "customerId",
        model: CustomerModel,
      })
      .exec();
    if (!carModelDoc) return null;
    return this.docToEntity(carModelDoc);
  }

  async findAll(customerId?: string): Promise<Car[]> {
    const query = customerId ? { customerId } : {};
    const carModelDocs = await CarModel.find(query)
      .populate({
        path: "carModelId",
        model: CarModelModel,
        populate: [{ path: "brandId", model: BrandModel }],
      })
      .populate({
        path: "customerId",
        model: CustomerModel,
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
        populate: [{ path: "brandId", model: BrandModel }],
      })
      .populate({
        path: "customerId",
        model: CustomerModel,
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
        populate: [{ path: "brandId", model: BrandModel }],
      })
      .populate({
        path: "customerId",
        model: CustomerModel,
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
      doc.carModelId.originalHp,
      doc.carModelId.originalTorque,
      doc.carModelId.topSpeed,
      [], //TODO: Add Files and CarModel entities
      doc.carModelId.isActive,
      doc.carModelId._id,
    );

    const customer = new Customer(
      doc.customerId.name,
      doc.customerId.lastName,
      doc.customerId.city,
      doc.customerId.state,
      doc.customerId.country,
      doc.customerId.phone,
      doc.customerId.email,
      doc.customerId.rfc,
      doc.customerId.razonSocial,
      doc.customerId.contacto,
      doc.customerId.companyId,
      doc.customerId._id?.toString(),
    );

    const car = new Car(
      doc.vin,
      doc.plates,
      carModel,
      customer,
      doc.year,
      doc.transmissionType,
      undefined,
      undefined,
      doc.id?.toString(),
    );

    return car;
  }
}
