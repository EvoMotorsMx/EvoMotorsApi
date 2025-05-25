import { ProductType, ProductSystemType } from "../../../../shared/enums";

export type CreateProductDTO = {
  name: string;
  type: ProductType;
  description?: string;
  sku?: string;
  productGroupId?: string;
  productBrandId?: string;
  systemType?: ProductSystemType;
  stock?: number;
  price?: number;
  complementId?: string | null; // FK → Product, puede ser nulo si no es un complemento
};
