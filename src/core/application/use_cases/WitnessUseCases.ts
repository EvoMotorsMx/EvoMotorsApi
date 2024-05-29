import { Witness } from "../../domain/entities";
import { CreateWitnessDTO, UpdateWitnessDTO } from "../dtos";
import { IWitnessService, IWitnessUseCases } from "../interfaces";

export class WitnessUseCases implements IWitnessUseCases {
  private witnessService: IWitnessService;

  constructor(witnessService: IWitnessService) {
    this.witnessService = witnessService;
  }

  async findAllWitnesses(): Promise<Witness[]> {
    return this.witnessService.getAllWitnesses();
  }

  async createWitness(dto: CreateWitnessDTO): Promise<Witness> {
    return this.witnessService.createWitness(dto);
  }

  async updateWitness(
    id: string,
    dto: UpdateWitnessDTO,
  ): Promise<Witness | null> {
    return this.witnessService.updateWitness(id, dto);
  }

  async getWitness(id: string): Promise<Witness | null> {
    return this.witnessService.getWitnessById(id);
  }

  async removeWitness(id: string): Promise<void> {
    return this.witnessService.deleteWitness(id);
  }
}
