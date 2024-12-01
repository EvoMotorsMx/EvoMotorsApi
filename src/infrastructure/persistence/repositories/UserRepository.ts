import { IUserRepository } from "../../../core/application/interfaces/User/IUserRepository";
import { User } from "../../../core/domain/entities";
import { CognitoIdentityServiceProvider } from "aws-sdk";

export class UserRepository implements IUserRepository {
  private cognitoIdentityServiceProvider: CognitoIdentityServiceProvider;

  constructor() {
    this.cognitoIdentityServiceProvider = new CognitoIdentityServiceProvider({
      region: process.env.AWS_REGION, // specify your region
    });
  }

  async findById(id: string): Promise<User | null> {
    return null;
  }

  async findAll(): Promise<User[]> {
    try {
      const data = await this.cognitoIdentityServiceProvider
        .listUsers({
          UserPoolId: process.env.AWS_COGNITO_ID || "", // specify your User Pool Id
        })
        .promise();

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
