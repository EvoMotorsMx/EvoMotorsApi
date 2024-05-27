import { Witness } from "../../../domain/entities";
import { CreateWitnessDTO, UpdateWitnessDTO } from "../../dtos/Witness";

export interface IWitnessService {
  createWitness(dto: CreateWitnessDTO): Promise<Witness>;
  getWitnessById(id: string): Promise<Witness | null>;
  getAllWitnesses(): Promise<Witness[]>;
  updateWitness(id: string, dto: UpdateWitnessDTO): Promise<Witness | null>;
  deleteWitness(id: string): Promise<void>;
}
