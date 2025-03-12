import { convertToBase64 } from "../../../shared/utils/base64Converter";
import { CreateReceiptDTO, UpdateReceiptDTO } from "../../application/dtos";
import {
  IReceiptRepository,
  IReceiptService,
} from "../../application/interfaces";
import { Receipt } from "../entities";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { PDFDocument, rgb } from "pdf-lib";
import { Readable } from "stream";

export class ReceiptService implements IReceiptService {
  private s3: S3Client;
  private receiptRepository: IReceiptRepository;

  constructor(receiptRepository: IReceiptRepository) {
    this.s3 = new S3Client({});
    this.receiptRepository = receiptRepository;
  }

  async getReceiptById(id: string): Promise<Receipt | null> {
    return this.receiptRepository.findById(id);
  }

  async getAllReceipts(): Promise<Receipt[]> {
    return this.receiptRepository.findAll();
  }

  async createReceipt(dto: CreateReceiptDTO): Promise<Receipt | null> {
    // Convertir imágenes a base64 si no están ya en ese formato
    if (dto.signImage && !dto.signImage.startsWith("data:image")) {
      dto.signImage = convertToBase64(dto.signImage);
    }
    if (dto.damageImages) {
      dto.damageImages = dto.damageImages.map((image: string) =>
        image.startsWith("data:image") ? image : convertToBase64(image),
      );
    }
    if (dto.scannerDescriptionImages) {
      dto.scannerDescriptionImages = dto.scannerDescriptionImages.map(
        (image: string) =>
          image.startsWith("data:image") ? image : convertToBase64(image),
      );
    }

    return this.receiptRepository.save(dto);
  }

  async updateReceipt(
    id: string,
    dto: UpdateReceiptDTO,
  ): Promise<Receipt | null> {
    // Convertir imágenes a base64 si no están ya en ese formato
    if (dto.signImage && !dto.signImage.startsWith("data:image")) {
      dto.signImage = convertToBase64(dto.signImage);
    }
    if (dto.damageImages) {
      dto.damageImages = dto.damageImages.map((image: string) =>
        image.startsWith("data:image") ? image : convertToBase64(image),
      );
    }
    if (dto.scannerDescriptionImages) {
      dto.scannerDescriptionImages = dto.scannerDescriptionImages.map(
        (image: string) =>
          image.startsWith("data:image") ? image : convertToBase64(image),
      );
    }

    return this.receiptRepository.update(id, dto);
  }

  async deleteReceipt(id: string): Promise<void> {
    await this.receiptRepository.deleteById(id);
  }

  async generatePdfFromTemplate(
    receiptId: string,
    templateKey: string,
  ): Promise<Buffer> {
    const receipt = await this.receiptRepository.findById(receiptId);

    if (!receipt) {
      throw new Error("Receipt not found");
    }

    const params = {
      Bucket: process.env.BUCKET_NAME!,
      Key: templateKey,
    };

    const command = new GetObjectCommand(params);
    const data = await this.s3.send(command);

    const streamToBuffer = (stream: Readable): Promise<Buffer> => {
      return new Promise((resolve, reject) => {
        const chunks: any[] = [];
        stream.on("data", (chunk) => chunks.push(chunk));
        stream.on("error", reject);
        stream.on("end", () => resolve(Buffer.concat(chunks)));
      });
    };

    const pdfBuffer = await streamToBuffer(data.Body as Readable);
    const pdfDoc = await PDFDocument.load(new Uint8Array(pdfBuffer));

    // Editar el PDF usando pdf-lib
    const pages = pdfDoc.getPages();
    const firstPage = pages[0];
    firstPage.drawText(`Receipt ID: ${receiptId}`, {
      x: 50,
      y: 700,
      size: 30,
      color: rgb(0, 0, 0),
    });

    const pdfBytes = await pdfDoc.save();
    return Buffer.from(pdfBytes);
  }
}
