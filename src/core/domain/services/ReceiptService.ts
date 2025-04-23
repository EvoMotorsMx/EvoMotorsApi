import { convertToBase64 } from "../../../shared/utils/base64Converter";
import { CreateReceiptDTO, UpdateReceiptDTO } from "../../application/dtos";
import {
  IReceiptRepository,
  IReceiptService,
} from "../../application/interfaces";
import { Receipt } from "../entities";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { PDFDocument } from "pdf-lib";
import { Readable } from "stream";
import { writeFileSync } from "fs";
import { v4 as uuidv4 } from "uuid";
import {
  CombustionType,
  EngineType,
  TransmissionType,
} from "../../../shared/enums";

interface PDFOrderKeys {
  [key: string]: string | undefined;
}

interface PDFOrderCheckKeys {
  [key: string]: boolean;
}

export class ReceiptService implements IReceiptService {
  private s3: S3Client;
  private receiptRepository: IReceiptRepository;

  constructor(receiptRepository: IReceiptRepository) {
    console.log("Receipt service init...");
    this.s3 = new S3Client({ region: process.env.AWS_REGION_COGNITO });
    this.receiptRepository = receiptRepository;
    console.log("Receipt constructor finished init..");
  }

  async getReceiptById(id: string): Promise<Receipt | null> {
    console.log("calling findById...");
    return this.receiptRepository.findById(id);
  }

  async getAllReceipts(): Promise<Receipt[]> {
    console.log("calling findAll...");
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
    try {
      const pdfOrderTextKeys: PDFOrderKeys = {
        orderId: receiptId ?? "",
        dayDate: receipt.createdAt?.getDay().toString() ?? "",
        monthDate: receipt.createdAt?.getMonth().toString() ?? "",
        yearDate: receipt.createdAt?.getDay().toString() ?? "",
        name: `${receipt.carId?.customerId.name.toString()} ${receipt.carId?.customerId.lastName.toString()}`,
        phone: receipt.carId?.customerId.phone ?? "",
        email: receipt.carId?.customerId.email ?? "",
        arriveTime: receipt.createdAt?.getTime().toString() ?? "",
        endTime: "",
        brand: receipt.carId?.carModelId.brandId.name ?? "",
        model: receipt.carId?.carModelId.name ?? "",
        damageParagraph: receipt.damageStatusDescription ?? "",
        scannerParagraph: receipt.scannerDescription ?? "",
        topboostPart: "",
        topboostProPart: "",
        otherProducts: receipt.productInstalled?.[0]?.product?.name ?? "",
        modelYear: receipt.carId?.year.toString() ?? "",
        mileage: receipt.mileage.toString() ?? "",
        engineSize: receipt.carId?.carModelId.engineSize ?? "",
        cylinders: receipt.carId?.carModelId.cylinder.toString() ?? "",
        plates: receipt.carId?.plates ?? "",
        vin: receipt.carId?.vin ?? "",
      };

      const pdfOrderCheckKeys: PDFOrderCheckKeys = {
        gasolineCheck:
          receipt.carId?.carModelId.combustion === CombustionType.Gasolina,
        dieselCheck:
          receipt.carId?.carModelId.combustion === CombustionType.Diesel,
        manualCheck:
          receipt.carId?.transmissionType === TransmissionType.Manual,
        autoCheck:
          receipt.carId?.transmissionType === TransmissionType.Automatico,
        aspiredCheck:
          receipt.carId?.carModelId.engineType === EngineType.Aspirado,
        turboCheck: receipt.carId?.carModelId.engineType === EngineType.Turbo,
        superChargedCheck:
          receipt.carId?.carModelId.engineType === EngineType.SuperCargado,
      };
      // Log the forms in the PDF if any
      const forms = pdfDoc.getForm();
      const fields = forms.getFields();

      for (let field of fields) {
        try {
          const type = field.constructor.name;
          const name = field.getName();
          console.log(`${type}: ${name}`);
          if (pdfOrderTextKeys[name] || pdfOrderCheckKeys[name]) {
            switch (type) {
              case "PDFTextField":
                const textField = forms.getTextField(name);
                textField.setText(pdfOrderTextKeys[name]);
                break;
              case "PDFCheckBox":
                const checkField = forms.getCheckBox(name);
                checkField.check();
                break;
              default:
                console.error(`Type not recognized`);
                break;
            }
          }
        } catch (error) {
          console.error(
            `Error setting text for field ${field.getName()}: ${error}`,
          );
        }
      }

      // Continue editing the PDF as needed...
      // ...
      forms.flatten();
    } catch (error) {
      console.error(error);
    }

    const pdfBytes = await pdfDoc.save();
    const outputPath = `./${uuidv4()}.pdf`;
    // Write the modified PDF to a file with a UUID name
    writeFileSync(outputPath, pdfBytes);
    console.log(`Saved modified PDF to ${outputPath}`);
    return Buffer.from(pdfBytes);
  }
}
