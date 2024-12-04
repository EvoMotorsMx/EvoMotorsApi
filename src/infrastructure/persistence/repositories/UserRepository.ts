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

  async findById(sub: string): Promise<User | null> {
    try {
      const command = new ListUsersCommand({
        UserPoolId: this.userPoolId,
        Filter: `sub = "${sub}"`,
        Limit: 1,
      });
      const data = await this.cognitoClient.send(command);

      if (data.Users && data.Users.length > 0) {
        const cognitoUser = data.Users[0];
        return new User(cognitoUser.Username!, cognitoUser.Attributes!);
      } else {
        console.log("No user found with the given sub ID.");
        return null;
      }
    } catch (error) {
      console.error("Error fetching user by sub ID from Cognito:", error);
      throw error;
    }
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
