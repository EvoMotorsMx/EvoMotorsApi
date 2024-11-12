import { CarModel, Certificate, ErrorCode, Remission, Witness } from "./index";

export class Car {
  constructor(
    public mileage: number,
    public tankStatus: number,
    public damangeImageUrl: string,
    public damageStatusDescription: string,
    public scannerDescription: string,
    public vin: string,
    public plates: string,
    public leadId: string,
    public carModelId: CarModel,
    public certifacteId?: Certificate,
    public remissions?: Remission[],
    public witnesses?: Witness[],
    public errorCodes?: ErrorCode[],
    public _id?: string,
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
