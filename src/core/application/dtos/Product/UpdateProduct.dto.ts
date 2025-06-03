import { ProductType, ProductSystemType } from "../../../../shared/enums";

export type UpdateProductDTO = {
  name?: string;
  type: ProductType;
  description?: string;
  sku?: string;
  productGroupId?: string;
  systemType?: ProductSystemType;
  stock?: number;
  price?: number;
  isComplement?: boolean; // indica si es un complemento
};
