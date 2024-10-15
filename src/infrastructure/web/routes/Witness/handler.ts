import {
  APIGatewayProxyEventV2,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";
import { connectToDatabase } from "../../../../shared/utils/db-connection";
import { WitnessService } from "../../../../core/domain/services/WitnessService";
import { WitnessUseCases } from "../../../../core/application/use_cases/WitnessUseCases";
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
import { WitnessRepository } from "../../../persistence/repositories/WitnessRepository";
import { decodeToken } from "../../../../shared/utils/userDecoder";
import { CUSTOMER_ROLE } from "../../../../shared/constants/roles";
import { IIdToken } from "../../../security/Auth";

const createWitnessBodySchema = z.object({
  name: z.string(),
  description: z.string().optional(),
});

const updateWitnessBodySchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  description: z.string().optional(),
});

const removeWitnessBody = z.object({
  id: z.string(),
});

const getWitnessBody = z.object({
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

  await connectToDatabase();
  const witnessRepository = new WitnessRepository();
  const witnessService = new WitnessService(witnessRepository);
  const witnessUseCases = new WitnessUseCases(witnessService);

  try {
    switch (event.requestContext.http.method) {
      case GET:
        if (event.pathParameters) {
          const pathValidationResult = getWitnessBody.safeParse({
            id: event.pathParameters.witnessId,
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

          const witnesses = await witnessUseCases.getWitness(
            pathValidationResult.data.id,
          );
          return {
            statusCode: HTTP_OK,
            body: JSON.stringify(witnesses),
          };
        } else {
          const witnesses = await witnessUseCases.findAllWitnesses();
          return {
            statusCode: HTTP_OK,
            body: JSON.stringify(witnesses),
          };
        }

      case POST: {
        const payload = JSON.parse(event.body ?? "{}");
        const validationResult = createWitnessBodySchema.safeParse(payload);
        let newWitness;
        if (validationResult.success) {
          newWitness = await witnessUseCases.createWitness(payload);
        } else {
          return {
            statusCode: HTTP_BAD_REQUEST,
            headers: { "Content-Type": "text/json" },

            body: JSON.stringify({
              message: "Invalid input data",
              errors: validationResult.error,
            }),
          };
        }

        return {
          statusCode: HTTP_CREATED,
          body: JSON.stringify(newWitness),
        };
      }

      case PATCH: {
        const payload = JSON.parse(event.body ?? "{}");
        let updatedWitness;

        if (!event.pathParameters || !event.pathParameters.witnessId) {
          return {
            statusCode: HTTP_BAD_REQUEST,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              message: "Witness ID is required in the path",
            }),
          };
        }

        const validationResult = updateWitnessBodySchema.safeParse({
          ...payload,
          id: event.pathParameters.witnessId,
        });

        if (validationResult.success) {
          updatedWitness = await witnessUseCases.updateWitness(
            event.pathParameters.witnessId,
            payload,
          );
        } else {
          return {
            statusCode: HTTP_BAD_REQUEST,
            headers: { "Content-Type": "text/json" },
            body: JSON.stringify({
              message: "Invalid input data",
              errors: validationResult.error,
            }),
          };
        }

        return {
          statusCode: HTTP_OK,
          body: JSON.stringify(updatedWitness),
        };
      }

      case DELETE: {
        if (!event.pathParameters || !event.pathParameters.witnessId) {
          return {
            statusCode: HTTP_BAD_REQUEST,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              message: "Witness ID is required in the path",
            }),
          };
        }

        const pathValidationResult = removeWitnessBody.safeParse({
          id: event.pathParameters.witnessId,
        });

        if (!pathValidationResult.success) {
          return {
            statusCode: HTTP_BAD_REQUEST,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              message: "Invalid or missing Witness ID",
              errors: pathValidationResult.error.issues,
            }),
          };
        }

        const witnessId = pathValidationResult.data.id;

        try {
          await witnessUseCases.removeWitness(witnessId);
          return {
            statusCode: HTTP_OK,
            body: JSON.stringify({
              id: witnessId,
              message: "Witness removed successfully",
            }),
          };
        } catch (error) {
          return {
            statusCode: HTTP_INTERNAL_SERVER_ERROR,
            body: JSON.stringify({
              message: "An error occurred while removing the witness",
            }),
          };
        }
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
