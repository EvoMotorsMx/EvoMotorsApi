import { Document } from "mongoose";
import ToolCompatibilityModel, {
  ToolCompatibilityDocument,
} from "../models/ToolCompatibility.model";
import {
  Brand,
  CarModel,
  Product,
  Tool,
  ToolCompatibility,
} from "../../../core/domain/entities";
import {
  CreateToolCompatibilityDTO,
  UpdateToolCompatibilityDTO,
} from "../../../core/application/dtos";
import { IToolCompatibilityRepository } from "../../../core/application/interfaces";

interface ToolCompatibilityDoc extends Document, ToolCompatibilityDocument {}

export class ToolCompatibilityRepository
  implements IToolCompatibilityRepository
{
  async findById(id: string): Promise<ToolCompatibility | null> {
    const toolDoc = await ToolCompatibilityModel.findById(id).exec();
    if (!toolDoc) return null;
    return this.docToEntity(toolDoc);
  }

  async findAll(): Promise<ToolCompatibility[]> {
    const toolDocs = await ToolCompatibilityModel.find().exec();
    if (!toolDocs.length) return [];
    return toolDocs.map((doc) => this.docToEntity(doc));
  }

  async save(dto: CreateToolCompatibilityDTO): Promise<ToolCompatibility> {
    const toolDoc = new ToolCompatibilityModel(dto);
    const savedToolCompatibilityDoc = await toolDoc.save();
    return this.docToEntity(savedToolCompatibilityDoc);
  }

  async update(
    id: string,
    dto: UpdateToolCompatibilityDTO,
  ): Promise<ToolCompatibility> {
    const updatedToolCompatibilityDoc =
      await ToolCompatibilityModel.findByIdAndUpdate(id, dto, {
        new: true,
      }).exec();
    if (!updatedToolCompatibilityDoc)
      throw new Error("ToolCompatibility not found");
    return this.docToEntity(updatedToolCompatibilityDoc);
  }

  async deleteById(id: string): Promise<void> {
    await ToolCompatibilityModel.findByIdAndDelete(id).exec();
  }

  private docToEntity(doc: ToolCompatibilityDoc): ToolCompatibility {
    const tool = new Tool(
      doc.tool.name,
      doc.tool.totalQuantity,
      doc.tool.availableQuantity,
      doc.tool.description,
      doc._id?.toString(),
    );

    const brand = new Brand(
      doc.carModel.brandId.name,
      doc.carModel.brandId.description,
      doc.carModel.brandId._id?.toString(),
    );

    const carModel = new CarModel(
      doc.carModel.name,
      brand,
      doc.carModel.year,
      doc.carModel.engineSize,
      doc.carModel.cylinder,
      doc.carModel.combustion,
      doc.carModel.engineType,
      [],
      [],
      doc.carModel._id?.toString(),
    );

    const toolCompatibility = new ToolCompatibility(
      carModel,
      tool,
      doc._id?.toString(),
    );

    return toolCompatibility;
  }
}
