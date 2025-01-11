import {
  CarModel,
  Certificate,
  Customer,
  ErrorCode,
  Remission,
  Witness,
} from "./index";

export class Car {
  constructor(
    public mileage: number,
    public tankStatus: number,
    public damageImageUrl: string[],
    public damageStatusDescription: string,
    public scannerDescription: string,
    public vin: string,
    public plates: string,
    public carModelId: CarModel,
    public customerId: Customer,
    public certificateId?: Certificate,
    public remissions?: Remission[],
    public witnesses?: Witness[],
    public errorCodes?: ErrorCode[],
    public files?: File[],
    public _id?: string,
  ) {}

  setId(id: string) {
    if (!this._id) {
      this._id = id;
    }
  }

  setCertificate(certificate: Certificate) {
    if (!this.certificateId) {
      this.certificateId = certificate;
    }
  }
}
