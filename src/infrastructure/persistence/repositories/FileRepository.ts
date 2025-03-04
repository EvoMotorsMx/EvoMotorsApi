import { Document } from "mongoose";
import { File } from "../../../core/domain/entities/File";
import FileModel, { FileDocument } from "../models/File.model";
import { IFileRepository } from "../../../core/application/interfaces/File/IFileRepository";
import {
  CreateFileDTO,
  UpdateFileDTO,
} from "../../../core/application/dtos/File";
import { Brand, CarModel } from "../../../core/domain/entities";

interface FileDoc extends Document, FileDocument {}

export class FileRepository implements IFileRepository {
  async findById(id: string): Promise<File | null> {
    const fileDoc = await FileModel.findById(id).exec();
    if (!fileDoc) return null;
    return this.docToEntity(fileDoc);
  }

  async findAll(): Promise<File[]> {
    const filelDocs = await FileModel.find().exec();
    if (!filelDocs.length) return [];
    return filelDocs.map((doc) => this.docToEntity(doc)); // Convertir cada documento a una entidad Brand
  }

  async save(dto: CreateFileDTO): Promise<File> {
    const fileDoc = new FileModel(dto);
    const savedFileDoc = await fileDoc.save();
    return this.docToEntity(savedFileDoc);
  }

  async update(id: string, dto: UpdateFileDTO): Promise<File> {
    const updatedFileDoc = await FileModel.findByIdAndUpdate(id, dto, {
      new: true,
    }).exec();
    if (!updatedFileDoc) throw new Error("Car Model not found");
    return this.docToEntity(updatedFileDoc);
  }

  async deleteById(id: string): Promise<void> {
    await FileModel.findByIdAndDelete(id).exec();
  }

  private docToEntity(doc: FileDoc): File {
    // Initialize placeholders for CarModel and File
    let brand: Brand = new Brand("", "");
    let carModelFiles: File[] = [];

    if (
      doc.carModelId &&
      typeof doc.carModelId === "object" &&
      "brandId" in doc.carModelId
    ) {
      if (
        doc.carModelId.brandId &&
        typeof doc.carModelId.brandId === "object"
      ) {
        brand = new Brand(
          doc.carModelId.brandId.name,
          doc.carModelId.brandId.description || "",
          doc.carModelId.brandId._id,
        );
      }

      if (Array.isArray(doc.carModelId.files)) {
        carModelFiles = doc.carModelId.files.map((file) => {
          if (
            typeof file === "object" &&
            file !== null &&
            "fileUrl" in file &&
            "type" in file &&
            "_id" in file
          ) {
            return new File(file.fileUrl, file.type, file._id!);
          } else {
            throw new Error("File data is not fully populated");
          }
        });
      }

      const carModel = new CarModel(
        doc.carModelId.name,
        brand,
        doc.carModelId.year,
        doc.carModelId.engineSize,
        doc.carModelId.cylinder,
        doc.carModelId.combustion,
        doc.carModelId.engineType,
        carModelFiles,
        doc.carModelId._id?.toString() as string,
      );

      const file = new File(doc.fileUrl, doc.type, carModel._id!);
      file.setId(doc._id?.toString() as string);
      return file;
    } else {
      throw new Error("CarModel details are not properly populated");
    }
  }
}
