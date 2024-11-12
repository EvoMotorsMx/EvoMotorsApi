import { Document } from "mongoose";
import ErrorCodeModel, { ErrorCodeDocument } from "../models/ErrorCode.model";
import BrandModel from "../models/Brand.model";
import { Brand, ErrorCode } from "../../../core/domain/entities";
import {
  CreateErrorCodeDTO,
  UpdateErrorCodeDTO,
} from "../../../core/application/dtos";
import { IErrorCodeRepository } from "../../../core/application/interfaces";

interface ErrorCodeDoc extends Document, ErrorCodeDocument {}

export class ErrorCodeRepository implements IErrorCodeRepository {
  async findById(id: string): Promise<ErrorCode | null> {
    const errorCodeDoc = await ErrorCodeModel.findById(id)
      .populate({ path: "brand", model: BrandModel })
      .exec();
    if (!errorCodeDoc) return null;
    return this.docToEntity(errorCodeDoc);
  }

  async findAll(): Promise<ErrorCode[]> {
    const errorCodeDocs = await ErrorCodeModel.find()
      .populate({ path: "brand", model: BrandModel })
      .exec();
    if (!errorCodeDocs.length) return [];
    return errorCodeDocs.map((doc) => this.docToEntity(doc)); // Convertir cada documento a una entidad ErrorCode
  }

  async save(dto: CreateErrorCodeDTO): Promise<ErrorCode> {
    const errorCodeDoc = new ErrorCodeModel(dto);
    const savedErrorCodeDoc = await errorCodeDoc.save();
    await savedErrorCodeDoc.populate({ path: "brandId", model: BrandModel });
    return this.docToEntity(savedErrorCodeDoc);
  }

  async update(id: string, dto: UpdateErrorCodeDTO): Promise<ErrorCode> {
    const updatedErrorCodeDoc = await ErrorCodeModel.findByIdAndUpdate(
      id,
      dto,
      {
        new: true,
      },
    )
      .populate({ path: "brand", model: BrandModel })
      .exec();
    if (!updatedErrorCodeDoc) throw new Error("ErrorCode not found");
    return this.docToEntity(updatedErrorCodeDoc);
  }

  async deleteById(id: string): Promise<void> {
    await ErrorCodeModel.findByIdAndDelete(id).exec();
  }

  private docToEntity(doc: ErrorCodeDoc): ErrorCode {
    const brand = new Brand(
      doc.brand.name,
      doc.brand.description,
      doc.brand._id,
    );

    const errorCode = new ErrorCode(doc.code, doc.name, brand, doc.description);
    return errorCode;
  }
}
