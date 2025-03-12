import { Receipt } from "../../domain/entities";
import { CreateReceiptDTO, UpdateReceiptDTO } from "../dtos";
import { IReceiptService, IReceiptUseCases } from "../interfaces";

export class ReceiptUseCases implements IReceiptUseCases {
  private receiptService: IReceiptService;

  constructor(receiptService: IReceiptService) {
    this.receiptService = receiptService;
  }

  async findAllReceipts(): Promise<Receipt[]> {
    return this.receiptService.getAllReceipts();
  }

  async createReceipt(dto: CreateReceiptDTO): Promise<Receipt | null> {
    return this.receiptService.createReceipt(dto);
  }

  async updateReceipt(
    id: string,
    dto: UpdateReceiptDTO,
  ): Promise<Receipt | null> {
    return this.receiptService.updateReceipt(id, dto);
  }

  async getReceipt(id: string): Promise<Receipt | null> {
    return this.receiptService.getReceiptById(id);
  }

  async removeReceipt(id: string): Promise<void> {
    return this.receiptService.deleteReceipt(id);
  }

  async generatePdfFromTemplate(
    receiptId: string,
    templateKey: string,
  ): Promise<Buffer> {
    return this.receiptService.generatePdfFromTemplate(receiptId, templateKey);
  }
}
