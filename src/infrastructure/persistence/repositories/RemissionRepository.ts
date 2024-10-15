import { Document } from "mongoose";
import RemissionModel, { RemissionDocument } from "../models/Remission.model";
import { IRemissionRepository } from "../../../core/application/interfaces/Remission/IRemissionRepository";
import { Remission } from "../../../core/domain/entities";
import {
  CreateRemissionDTO,
  UpdateRemissionDTO,
} from "../../../core/application/dtos";

interface RemissionDoc extends Document, RemissionDocument {}

export class RemissionRepository implements IRemissionRepository {
  async findById(id: string): Promise<Remission | null> {
    const remissionDoc = await RemissionModel.findById(id).exec();
    if (!remissionDoc) return null;
    return this.docToEntity(remissionDoc);
  }

  async findAll(): Promise<Remission[]> {
    const remissionDocs = await RemissionModel.find().exec();
    if (!remissionDocs.length) return [];
    return remissionDocs.map((doc) => this.docToEntity(doc)); // Convertir cada documento a una entidad Remission
  }

  async save(dto: CreateRemissionDTO): Promise<Remission> {
    const remissionDoc = new RemissionModel(dto);
    const savedRemissionDoc = await remissionDoc.save();
    return this.docToEntity(savedRemissionDoc);
  }

  async update(id: string, dto: UpdateRemissionDTO): Promise<Remission> {
    const updatedRemissionDoc = await RemissionModel.findByIdAndUpdate(id, dto, {
      new: true,
    }).exec();
    if (!updatedRemissionDoc) throw new Error("Remission not found");
    return this.docToEntity(updatedRemissionDoc);
  }

  async deleteById(id: string): Promise<void> {
    await RemissionModel.findByIdAndDelete(id).exec();
  }

  private docToEntity(doc: RemissionDoc): Remission {
    //const remission = new Remission(doc.name, doc.description, doc._id.toString());
    const remission = new Remission(
      doc.name,
      doc.id,
      doc.remission,
      doc.date,
      doc.contact,
      doc.cellphone,
      doc.city,
      doc.brand,
      doc.modelo,
      doc.email,
      doc.socialNetwork,
      doc.rfc,
      doc.bill,
      doc.cfdiUse,
      doc.mileage,
      doc.year,
      doc.engine,
      doc.vim,
      );
    return remission;
  }
}
