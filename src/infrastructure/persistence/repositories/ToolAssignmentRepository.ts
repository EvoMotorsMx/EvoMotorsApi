import { Document } from "mongoose";
import ToolAssignmentModel, {
  ToolAssignmentDocument,
} from "../models/ToolAssignment.model";
import { IToolAssignmentRepository } from "../../../core/application/interfaces/ToolAssignment/IToolAssignmentRepository";
import { Tool, ToolAssignment } from "../../../core/domain/entities";
import {
  CreateToolAssignmentDTO,
  UpdateToolAssignmentDTO,
} from "../../../core/application/dtos";

interface ToolAssignmentDoc extends Document, ToolAssignmentDocument {}

export class ToolAssignmentRepository implements IToolAssignmentRepository {
  async findById(id: string): Promise<ToolAssignment | null> {
    const toolDoc = await ToolAssignmentModel.findById(id).exec();
    if (!toolDoc) return null;
    return this.docToEntity(toolDoc);
  }

  async findAll(): Promise<ToolAssignment[]> {
    const toolDocs = await ToolAssignmentModel.find().exec();
    if (!toolDocs.length) return [];
    return toolDocs.map((doc) => this.docToEntity(doc));
  }

  async save(dto: CreateToolAssignmentDTO): Promise<ToolAssignment> {
    const toolDoc = new ToolAssignmentModel(dto);
    const savedToolAssignmentDoc = await toolDoc.save();
    return this.docToEntity(savedToolAssignmentDoc);
  }

  async update(
    id: string,
    dto: UpdateToolAssignmentDTO,
  ): Promise<ToolAssignment> {
    const updatedToolAssignmentDoc =
      await ToolAssignmentModel.findByIdAndUpdate(id, dto, {
        new: true,
      }).exec();
    if (!updatedToolAssignmentDoc) throw new Error("ToolAssignment not found");
    return this.docToEntity(updatedToolAssignmentDoc);
  }

  async deleteById(id: string): Promise<void> {
    await ToolAssignmentModel.findByIdAndDelete(id).exec();
  }

  private docToEntity(doc: ToolAssignmentDoc): ToolAssignment {
    const tool = new Tool(
      doc.tool.name,
      doc.tool.totalQuantity,
      doc.tool.description,
      doc._id?.toString(),
    );

    const toolAssignment = new ToolAssignment(
      doc.initDate,
      doc.endDate,
      doc.assignedQuantity,
      tool,
      doc.cognitoId,
      doc._id?.toString(),
    );
    return toolAssignment;
  }
}
