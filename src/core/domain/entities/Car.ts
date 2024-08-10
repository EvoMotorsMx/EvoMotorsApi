import { EngineType } from "../../../shared/enums";
import { CarModel, Certificate, Remission, Witness } from "./index";

export class Car {
  constructor(
    public mileage: number,
    public tankStatus: number,
    public damangeImageUrl: string,
    public statusDescription: string,
    public damangeDescription: string,
    public scannerDescription: string,
    public vin: EngineType,
    public plates: string,
    public leadId: string,
    public carModelId: CarModel,
    public certifacteId?: Certificate,
    public _id?: string,
    public remissions?: Remission[],
    public witnesses?: Witness[],
  ) {}

  setId(id: string) {
    if (!this._id) {
      this._id = id;
    }
  }

  setCertificate(certificate: Certificate) {
    if (!this.certifacteId) {
      this.certifacteId = certificate;
    }
  }
}
