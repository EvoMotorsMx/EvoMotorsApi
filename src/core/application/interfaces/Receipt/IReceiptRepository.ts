import { Receipt } from "../../../domain/entities";
import { CreateReceiptDTO, UpdateReceiptDTO } from "../../dtos";

export interface IReceiptRepository {
  findById(id: string): Promise<Receipt | null>;
  findAll(): Promise<Receipt[]>;
  save(dto: CreateReceiptDTO): Promise<Receipt>;
  update(id: string, dto: UpdateReceiptDTO): Promise<Receipt>;
  deleteById(id: string): Promise<void>;
}
