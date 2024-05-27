import { Witness } from "../../../domain/entities";
import { CreateWitnessDTO, UpdateWitnessDTO } from "../../dtos/Witness";

export interface IWitnessRepository {
  findById(id: string): Promise<Witness | null>;
  findAll(): Promise<Witness[]>;
  save(dto: CreateWitnessDTO): Promise<Witness>;
  update(id: string, dto: UpdateWitnessDTO): Promise<Witness>;
  deleteById(id: string): Promise<void>;
}
