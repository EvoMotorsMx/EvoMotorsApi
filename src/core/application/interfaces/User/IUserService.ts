import { User } from "../../../domain/entities";

export interface IUserService {
  getUserById(id: string): Promise<User | null>;
  getAllUsers(): Promise<User[]>;
}
