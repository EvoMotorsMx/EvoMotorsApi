import { Document } from "mongoose";
import WitnessModel, { WitnessDocument } from "../models/Witness.model";
import { IWitnessRepository } from "../../../core/application/interfaces/Witness/IWitnessRepository";
import { Witness } from "../../../core/domain/entities";
import {
  CreateWitnessDTO,
  UpdateWitnessDTO,
} from "../../../core/application/dtos";

interface WitnessDoc extends Document, WitnessDocument {}

export class WitnessRepository implements IWitnessRepository {
  async findById(id: string): Promise<Witness | null> {
    const witnessDoc = await WitnessModel.findById(id).exec();
    if (!witnessDoc) return null;
    return this.docToEntity(witnessDoc);
  }

  async findAll(): Promise<Witness[]> {
    const witnessDocs = await WitnessModel.find().exec();
    if (!witnessDocs.length) return [];
    return witnessDocs.map((doc) => this.docToEntity(doc)); // Convertir cada documento a una entidad Witness
  }

  async save(dto: CreateWitnessDTO): Promise<Witness> {
    const witnessDoc = new WitnessModel(dto);
    const savedWitnessDoc = await witnessDoc.save();
    return this.docToEntity(savedWitnessDoc);
  }

  async update(id: string, dto: UpdateWitnessDTO): Promise<Witness> {
    const updatedWitnessDoc = await WitnessModel.findByIdAndUpdate(id, dto, {
      new: true,
    }).exec();
    if (!updatedWitnessDoc) throw new Error("Witness not found");
    return this.docToEntity(updatedWitnessDoc);
  }

  async deleteById(id: string): Promise<void> {
    await WitnessModel.findByIdAndDelete(id).exec();
  }

  private docToEntity(doc: WitnessDoc): Witness {
    const witness = new Witness(doc.name, doc.description, doc._id.toString());
    return witness;
  }
}
