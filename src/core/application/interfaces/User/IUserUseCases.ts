import { User } from "../../../domain/entities";

export interface IUserUseCases {
  getUser(id: string): Promise<User | null>;
  findAllUsers(): Promise<User[]>;
}
