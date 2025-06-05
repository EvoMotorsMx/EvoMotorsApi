import { ProductType, ProductSystemType } from "../../../../shared/enums";

export type CreateProductDTO = {
  name: string;
  type: ProductType;
  description?: string;
  sku?: string;
  productGroupId: string;
  systemType?: ProductSystemType;
  price?: number;
  isComplement?: boolean; // indica si es un complemento
};
