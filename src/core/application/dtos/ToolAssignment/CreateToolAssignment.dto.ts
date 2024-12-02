export type CreateToolAssignmentDTO = {
  initDate: Date;
  endDate: Date;
  assignedQuantity: number;
  tool: string;
  cognitoId: string;
};
