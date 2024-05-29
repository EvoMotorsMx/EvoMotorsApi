import { Witness } from "../../../domain/entities";
import { CreateWitnessDTO, UpdateWitnessDTO } from "../../dtos/Witness";

export interface IWitnessUseCases {
  createWitness(dto: CreateWitnessDTO): Promise<Witness>;
  updateWitness(id: string, dto: UpdateWitnessDTO): Promise<Witness | null>;
  getWitness(id: string): Promise<Witness | null>;
  findAllWitnesses(): Promise<Witness[]>;
  removeWitness(id: string): Promise<void>;
}
