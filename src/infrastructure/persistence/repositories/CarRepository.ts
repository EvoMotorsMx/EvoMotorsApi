import { Document } from "mongoose";
import CarModel, { CarDocument } from "../models/Car.model";
import CarModelModel from "../models/CarModel.model";
import BrandModel from "../models/Brand.model";
import WitnessModel from "../models/Witness.model";
import RemissionModel from "../models/Remission.model";
import CertificateModel from "../models/Certificate.model";
import ErrorCodeModel from "../models/ErrorCode.model";
import CustomerModel from "../models/Customer.model";
import {
  Brand,
  Car,
  CarModel as CarModelEntity,
  Certificate,
  Product,
  Remission,
  Witness,
  ErrorCode,
  ProductCompatibility,
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
        populate: { path: "brandId", model: BrandModel },
      })
      .populate({
        path: "witnesses",
        model: WitnessModel,
      })
      .populate({
        path: "remissions",
        model: RemissionModel,
      })
      .populate({
        path: "certificateId",
        model: CertificateModel,
      })
      .populate({
        path: "customerId",
        model: CustomerModel,
      })
      .populate({
        path: "errorCodes",
        model: ErrorCodeModel,
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
        path: "witnesses",
        model: WitnessModel,
      })
      .populate({
        path: "remissions",
        model: RemissionModel,
      })
      .populate({
        path: "certificateId",
        model: CertificateModel,
      })
      .populate({
        path: "customerId",
        model: CustomerModel,
      })
      .populate({
        path: "errorCodes",
        model: ErrorCodeModel,
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
        populate: { path: "brandId", model: BrandModel },
      })
      .populate({
        path: "witnesses",
        model: WitnessModel,
      })
      .populate({
        path: "remissions",
        model: RemissionModel,
      })
      .populate({
        path: "certificateId",
        model: CertificateModel,
      })
      .populate({
        path: "customerId",
        model: CustomerModel,
      })
      .populate({
        path: "errorCodes",
        model: ErrorCodeModel,
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
        populate: { path: "brandId", model: BrandModel },
      })
      .populate({
        path: "witnesses",
        model: WitnessModel,
      })
      .populate({
        path: "remissions",
        model: RemissionModel,
      })
      .populate({
        path: "certificateId",
        model: CertificateModel,
      })
      .populate({
        path: "customerId",
        model: CustomerModel,
      })
      .populate({
        path: "errorCodes",
        model: ErrorCodeModel,
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

    const carModelProducts = doc.carModelId.products as ProductCompatibility[];

    const products = carModelProducts.map(
      (product) =>
        new ProductCompatibility(
          product.product,
          product.carModel,
          product._id,
        ),
    );

    const carModel = new CarModelEntity(
      doc.carModelId.name,
      brand,
      doc.carModelId.year,
      doc.carModelId.engineSize,
      doc.carModelId.cylinder,
      doc.carModelId.combustion,
      doc.carModelId.engineType,
      [], //TODO: Add Files and CarModel entities
      products,
      doc.carModelId._id,
    );

    /*     const certificate = new Certificate(
      doc.certificateId.name,
      doc.id,
      doc.certificateId._id,
    ); */

    const remissions = doc.remissions?.map(
      (remission) => new Remission(remission.name, remission._id),
    );

    const errorCodes = doc.errorCodes?.map(
      (errorCode) =>
        new ErrorCode(
          errorCode.code,
          errorCode.name,
          errorCode.brand,
          errorCode.description,
          errorCode._id,
        ),
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
      doc.customerId.remissions,
      doc.customerId.cars,
      doc.customerId.company,
      doc.customerId._id,
    );

    const car = new Car(
      doc.vin,
      doc.plates,
      carModel,
      customer,
      undefined,
      remissions,
      [],
      doc.id?.toString(),
    );

    return car;
  }
}
