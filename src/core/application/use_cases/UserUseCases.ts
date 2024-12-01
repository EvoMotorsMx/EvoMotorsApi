import { User } from "../../domain/entities";
import { IUserService, IUserUseCases } from "../interfaces";

export class UserUseCases implements IUserUseCases {
  private userService: IUserService;

  constructor(userService: IUserService) {
    this.userService = userService;
  }

  async findAllUsers(): Promise<User[]> {
    return this.userService.getAllUsers();
  }

  async getUser(id: string): Promise<User | null> {
    return this.userService.getUserById(id);
  }
}
