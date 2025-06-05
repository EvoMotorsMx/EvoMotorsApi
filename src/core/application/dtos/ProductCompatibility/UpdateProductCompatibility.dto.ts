export type UpdateProductCompatibilityDTO = {
  productId?: string;
  carModelId?: string;
  endHp?: number; // Optional field for end horsepower
  endTorque?: number; // Optional field for end torque
  vMax?: string; // Optional field for maximum speed
  priceOverride?: number; // Optional field for price override
  priceAdditional?: number; // Optional field for additional price
  notes?: string; // Optional field for notes
  description?: string; // Optional field for description
  complementId?: string; // Optional field for complement product ID
};
