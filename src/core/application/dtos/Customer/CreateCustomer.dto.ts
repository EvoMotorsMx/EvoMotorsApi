import { ContactType } from "../../../../shared/enums";

export type CreateCustomerDTO = {
  name: string;
  lastName: string;
  city: string;
  state: string;
  country: string;
  phone: string;
  email: string;
  rfc: string;
  razonSocial: string;
  contacto: ContactType;
  remissions: string[];
};
