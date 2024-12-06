import { CarModel, Tool } from ".";

export class ToolCompatibility {
  constructor(
    public carModel: CarModel,
    public Tool: Tool,
    public _id?: string,
  ) {}

  // Method to set the id if it's not passed in the constructor
  setId(id: string) {
    if (!this._id) {
      this._id = id;
    }
  }
}
