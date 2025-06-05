export type CreateProductGroupDTO = {
  name: string;
  productBrandId: string; // FK → ProductBrand
  description?: string;
  image?: string;
};
