export type UpdateProductGroupDTO = {
  name?: string;
  productBrandId?: string; // FK → ProductBrand
  description?: string;
  image?: string;
};
