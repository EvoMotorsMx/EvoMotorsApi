import { Document } from "mongoose";
import CertificateModel, { CertificateDocument } from "../models/Certificate.model";
import { ICertificateRepository } from "../../../core/application/interfaces/Certificate/ICertificateRepository";
import { Certificate } from "../../../core/domain/entities";
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
    const updatedCertificateDoc = await CertificateModel.findByIdAndUpdate(id, dto, {
      new: true,
    }).exec();
    if (!updatedCertificateDoc) throw new Error("Certificate not found");
    return this.docToEntity(updatedCertificateDoc);
  }

  async deleteById(id: string): Promise<void> {
    await CertificateModel.findByIdAndDelete(id).exec();
  }

  private docToEntity(doc: CertificateDoc): Certificate {
    const certificate = new Certificate(
      //doc.name, doc.description, doc._id.toString()
      doc.name,
      doc.id,
      doc.date,
      doc.folio,
      doc.brand,
      doc.modelo,
      doc.year,
      doc.engine,
      doc.vim,
      doc.mileage,
    );
    return certificate;
  }
}
