import { CreateWitnessDTO, UpdateWitnessDTO } from "../../application/dtos";
import {
  IWitnessRepository,
  IWitnessService,
} from "../../application/interfaces";
import { Witness } from "../entities";

export class WitnessService implements IWitnessService {
  constructor(private witnessRepository: IWitnessRepository) {}

  async getWitnessById(id: string): Promise<Witness | null> {
    return this.witnessRepository.findById(id);
  }

  async getAllWitnesses(): Promise<Witness[]> {
    return this.witnessRepository.findAll();
  }

  async createWitness(dto: CreateWitnessDTO): Promise<Witness> {
    return this.witnessRepository.save(dto);
  }

  async updateWitness(
    id: string,
    dto: UpdateWitnessDTO,
  ): Promise<Witness | null> {
    return this.witnessRepository.update(id, dto);
  }

  async deleteWitness(id: string): Promise<void> {
    await this.witnessRepository.deleteById(id);
  }
}
