import { Document } from "mongoose";
import ToolModel, { ToolDocument } from "../models/Tool.model";
import { IToolRepository } from "../../../core/application/interfaces/Tool/IToolRepository";
import { Tool } from "../../../core/domain/entities";
import { CreateToolDTO, UpdateToolDTO } from "../../../core/application/dtos";

interface ToolDoc extends Document, ToolDocument {}

export class ToolRepository implements IToolRepository {
  async findById(id: string): Promise<Tool | null> {
    const toolDoc = await ToolModel.findById(id).exec();
    if (!toolDoc) return null;
    return this.docToEntity(toolDoc);
  }

  async findAll(): Promise<Tool[]> {
    const toolDocs = await ToolModel.find().exec();
    if (!toolDocs.length) return [];
    return toolDocs.map((doc) => this.docToEntity(doc)); // Convertir cada documento a una entidad Tool
  }

  async save(dto: CreateToolDTO): Promise<Tool> {
    const toolDoc = new ToolModel(dto);
    const savedToolDoc = await toolDoc.save();
    return this.docToEntity(savedToolDoc);
  }

  async update(id: string, dto: UpdateToolDTO): Promise<Tool> {
    const updatedToolDoc = await ToolModel.findByIdAndUpdate(id, dto, {
      new: true,
    }).exec();
    if (!updatedToolDoc) throw new Error("Tool not found");
    return this.docToEntity(updatedToolDoc);
  }

  async deleteById(id: string): Promise<void> {
    await ToolModel.findByIdAndDelete(id).exec();
  }

  private docToEntity(doc: ToolDoc): Tool {
    const tool = new Tool(doc.name, doc.description, doc._id?.toString());
    return tool;
  }
}
