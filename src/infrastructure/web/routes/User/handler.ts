import {
  APIGatewayProxyEventV2,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";
import { connectToDatabase } from "../../../../shared/utils/db-connection";
import { z } from "zod";
import {
  DELETE,
  GET,
  HTTP_BAD_REQUEST,
  HTTP_CREATED,
  HTTP_FORBIDDEN,
  HTTP_INTERNAL_SERVER_ERROR,
  HTTP_OK,
  HTTP_UNAUTHORIZED,
  PATCH,
  POST,
} from "../../../../shared/constants";
import { decodeToken } from "../../../../shared/utils/userDecoder";
import { CUSTOMER_ROLE } from "../../../../shared/constants/roles";
import { IIdToken } from "../../../security/Auth";
import { UserRepository } from "../../../persistence/repositories";
import { UserService } from "../../../../core/domain/services";
import { UserUseCases } from "../../../../core/application/use_cases";

const getUserBody = z.object({
  id: z.string(),
});

export async function handler(
  event: APIGatewayProxyEventV2,
  context: Context,
): Promise<APIGatewayProxyResult> {
  context.callbackWaitsForEmptyEventLoop = false;

  const idToken = event.headers["idtoken"];

  if (!idToken) {
    return {
      statusCode: HTTP_UNAUTHORIZED,
      body: JSON.stringify({ message: "Authorization token is required" }),
    };
  }

  let decoded;
  try {
    decoded = decodeToken(idToken) as IIdToken;
    const groups = decoded["cognito:groups"] || [];

    if (groups.includes(CUSTOMER_ROLE)) {
      return {
        statusCode: HTTP_FORBIDDEN,
        body: JSON.stringify({
          message: "Access denied: user is a member of customer group",
        }),
      };
    }
  } catch (error) {
    return {
      statusCode: HTTP_BAD_REQUEST,
      body: JSON.stringify({ message: "Invalid token" }),
    };
  }
  const userPoolId = process.env.AWS_COGNITO_ID;
  const awsRegion = process.env.AWS_REGION_COGNITO;

  // Verifica que las variables de entorno necesarias estén definidas
  if (!userPoolId || !awsRegion) {
    return {
      statusCode: HTTP_BAD_REQUEST,
      body: JSON.stringify({
        message: "Configuration error: Missing AWS Cognito configuration",
      }),
    };
  }

  // Crea el repositorio con las variables de entorno
  const userRepository = new UserRepository(userPoolId, awsRegion);
  const userService = new UserService(userRepository);
  const userUseCases = new UserUseCases(userService);

  try {
    switch (event.requestContext.http.method) {
      case GET:
        if (event.pathParameters) {
          const pathValidationResult = getUserBody.safeParse({
            id: event.pathParameters.userId,
          });
          if (!pathValidationResult.success) {
            return {
              statusCode: HTTP_BAD_REQUEST,
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                message: "Invalid ID",
                errors: pathValidationResult.error,
              }),
            };
          }

          const users = await userUseCases.getUser(
            pathValidationResult.data.id,
          );
          return {
            statusCode: HTTP_OK,
            body: JSON.stringify(users),
          };
        } else {
          const users = await userUseCases.findAllUsers();
          return {
            statusCode: HTTP_OK,
            body: JSON.stringify(users),
          };
        }

      default:
        return {
          statusCode: HTTP_BAD_REQUEST,
          body: JSON.stringify({ message: "Method Not Allowed" }),
        };
    }
  } catch (error) {
    return {
      statusCode: HTTP_INTERNAL_SERVER_ERROR,
      body: JSON.stringify({
        message: error instanceof Error ? error.message : "Server error",
      }),
    };
  }
}
