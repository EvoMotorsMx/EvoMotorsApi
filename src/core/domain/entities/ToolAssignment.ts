import { Tool } from "./index";

export class ToolAssignment {
  constructor(
    public initDate: Date,
    public endDate: Date,
    public assignedQuantity: number,
    public tool: Tool,
    public cognitoId: string,
    public _id?: string,
  ) {}

  // Method to set the id if it's not passed in the constructor
  setId(id: string) {
    if (!this._id) {
      this._id = id;
    }
  }
}
