import { Document } from "mongoose";
import CertificateModel, {
  CertificateDocument,
} from "../models/Certificate.model";
import { ICertificateRepository } from "../../../core/application/interfaces/Certificate/ICertificateRepository";
import {
  Brand,
  CarModel,
  Certificate,
  Car,
  Remission,
  Witness,
  File,
  Product,
} from "../../../core/domain/entities";
import {
  CreateCertificateDTO,
  UpdateCertificateDTO,
} from "../../../core/application/dtos";

interface CertificateDoc extends Document, CertificateDocument {}

export class CertificateRepository implements ICertificateRepository {
  async findById(id: string): Promise<Certificate | null> {
    const certificateDoc = await CertificateModel.findById(id).exec();
    if (!certificateDoc) return null;
    return this.docToEntity(certificateDoc);
  }

  async findAll(): Promise<Certificate[]> {
    const certificateDocs = await CertificateModel.find().exec();
    if (!certificateDocs.length) return [];
    return certificateDocs.map((doc) => this.docToEntity(doc)); // Convertir cada documento a una entidad Certificate
  }

  async save(dto: CreateCertificateDTO): Promise<Certificate> {
    const certificateDoc = new CertificateModel(dto);
    const savedCertificateDoc = await certificateDoc.save();
    return this.docToEntity(savedCertificateDoc);
  }

  async update(id: string, dto: UpdateCertificateDTO): Promise<Certificate> {
    const updatedCertificateDoc = await CertificateModel.findByIdAndUpdate(
      id,
      dto,
      {
        new: true,
      },
    ).exec();
    if (!updatedCertificateDoc) throw new Error("Certificate not found");
    return this.docToEntity(updatedCertificateDoc);
  }

  async deleteById(id: string): Promise<void> {
    await CertificateModel.findByIdAndDelete(id).exec();
  }

  private docToEntity(doc: CertificateDoc): Certificate {
    const brand = new Brand(
      doc.carId.carModelId.brandId.name,
      doc.carId.carModelId.brandId.description,
      doc.carId.carModelId.brandId._id,
    );

    const carModelFiles: File[] = doc.carId.carModelId?.files as File[];

    const files = carModelFiles.map(
      (file) => new File(file.fileUrl, file.type, file._id!),
    );

    const carModelProducts: Product[] = doc.carId.carModelId
      ?.products as Product[];

    const products = carModelProducts.map(
      (product) => new Product(product.name, product.description, product._id),
    );

    const carModel = new CarModel(
      doc.carId.carModelId.name,
      brand,
      doc.carId.carModelId.year,
      doc.carId.carModelId.engineSize,
      doc.carId.carModelId.cylinder,
      doc.carId.carModelId.combustion,
      doc.carId.carModelId.engineType,
      files,
      products,
      doc.carId.carModelId._id,
    );

    const remissions = doc.carId.remissions?.map(
      (remission) => new Remission(remission.name, remission._id),
    );

    const witnesses = doc.carId.witnesses?.map(
      (witness) => new Witness(witness.name, witness.description, witness._id),
    );

    const car = new Car(
      doc.carId.mileage,
      doc.carId.tankStatus,
      doc.carId.damangeImageUrl,
      doc.carId.damageStatusDescription,
      doc.carId.scannerDescription,
      doc.carId.vin,
      doc.carId.plates,
      doc.carId.leadId,
      carModel,
      undefined,
      remissions,
      witnesses,
      [], //TODO: ADD ERROR CODE MODEL
      doc.carId._id,
    );

    const certificate = new Certificate(doc.name, car, doc.id);

    car.setCertificate(certificate);

    return certificate;
  }
}
