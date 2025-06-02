export type UpdateProductBrandDTO = {
  name?: string;
  productBrandId?: string; // FK → ProductBrand
  description?: string;
  image?: string;
};
