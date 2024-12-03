import { IUserRepository } from "../../../core/application/interfaces/User/IUserRepository";
import { User } from "../../../core/domain/entities";
import {
  CognitoIdentityProviderClient,
  ListUsersCommand,
} from "@aws-sdk/client-cognito-identity-provider";

export class UserRepository implements IUserRepository {
  private cognitoClient: CognitoIdentityProviderClient;

  constructor(
    private userPoolId: string,
    private region: string,
  ) {
    this.cognitoClient = new CognitoIdentityProviderClient({
      region: this.region,
    });
  }

  async findById(id: string): Promise<User | null> {
    return null;
  }

  async findAll(): Promise<User[]> {
    try {
      const command = new ListUsersCommand({
        UserPoolId: this.userPoolId,
      });
      const data = await this.cognitoClient.send(command);

      return (
        data.Users?.map((user) => new User(user.Username!, user.Attributes!)) ||
        []
      );
    } catch (error) {
      console.error("Error fetching users from Cognito:", error);
      throw error;
    }
  }
}
