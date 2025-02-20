import { Receipt } from "../../../domain/entities";
import { CreateReceiptDTO, UpdateReceiptDTO } from "../../dtos";

export interface IReceiptUseCases {
  createReceipt(dto: CreateReceiptDTO): Promise<Receipt>;
  updateReceipt(id: string, dto: UpdateReceiptDTO): Promise<Receipt | null>;
  getReceipt(id: string): Promise<Receipt | null>;
  findAllReceipts(): Promise<Receipt[]>;
  removeReceipt(id: string): Promise<void>;
  generatePdfFromTemplate(
    receiptId: string,
    templateKey: string,
  ): Promise<Buffer>;
}
