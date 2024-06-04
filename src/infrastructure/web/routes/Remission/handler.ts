import {
  APIGatewayProxyEventV2,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";
import { connectToDatabase } from "../../../../shared/utils/db-connection";
import { RemissionService } from "../../../../core/domain/services/RemissionService";
import { RemissionUseCases } from "../../../../core/application/use_cases/RemissionUseCases";
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
import { RemissionRepository } from "../../../persistence/repositories/RemissionRepository";
import { decodeToken } from "../../../../shared/utils/userDecoder";
import { CUSTOMER_ROLE } from "../../../../shared/constants/roles";
import { IIdToken } from "../../../security/Auth";


const createRemissionBodySchema = z.object({
  remission: z.string(),
  date: z.string(),
  name: z.string(),
  contact: z.string().optional(),
  cellphone: z.string().optional(),
  city: z.string().optional(),
  brand: z.string().optional(),
  modelo: z.string().optional(),
  email: z.string().optional(),
  socialNetwork: z.string().optional(),
  rfc: z.string().optional(),
  bill: z.string().optional(),
  cdfiUse: z.string().optional(),
  mileage: z.string().optional(),
  year: z.string().optional(),
  engine: z.string().optional(),
  vim: z.string().optional(),
});

const updateRemissionBodySchema = z.object({
  id: z.string(),
  remission: z.string().optional(),
  date: z.string().optional(),
  name: z.string().optional(),
  contact: z.string().optional(),
  cellphone: z.string().optional(),
  city: z.string().optional(),
  brand: z.string().optional(),
  modelo: z.string().optional(),
  email: z.string().optional(),
  socialNetwork: z.string().optional(),
  rfc: z.string().optional(),
  bill: z.string().optional(),
  cdfiUse: z.string().optional(),
  mileage: z.string().optional(),
  year: z.string().optional(),
  engine: z.string().optional(),
  vim: z.string().optional(),
});

const removeRemissionBody = z.object({
  id: z.string(),
});

const getRemissionBody = z.object({
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
  const remissionRepository = new RemissionRepository();
  const remissionService = new RemissionService(remissionRepository);
  const remissionUseCases = new RemissionUseCases(remissionService);

  try {
    switch (event.requestContext.http.method) {
      case GET:
        if (event.pathParameters) {
          const pathValidationResult = getRemissionBody.safeParse({
            id: event.pathParameters.remissionId,
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

          const remissions = await remissionUseCases.getRemission(
            pathValidationResult.data.id,
          );
          return {
            statusCode: HTTP_OK,
            body: JSON.stringify(remissions),
          };
        } else {
          const remissions = await remissionUseCases.findAllRemissions();
          return {
            statusCode: HTTP_OK,
            body: JSON.stringify(remissions),
          };
        }

      case POST: {
        const payload = JSON.parse(event.body ?? "{}");
        const validationResult = createRemissionBodySchema.safeParse(payload);
        let newRemission;
        if (validationResult.success) {
          newRemission = await remissionUseCases.createRemission(payload);
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
          body: JSON.stringify(newRemission),
        };
      }

      case PATCH: {
        const payload = JSON.parse(event.body ?? "{}");
        let updatedRemission;

        if (!event.pathParameters || !event.pathParameters.remissionId) {
          return {
            statusCode: HTTP_BAD_REQUEST,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              message: "Remission ID is required in the path",
            }),
          };
        }

        const validationResult = updateRemissionBodySchema.safeParse({
          ...payload,
          id: event.pathParameters.remissionId,
        });

        if (validationResult.success) {
          updatedRemission = await remissionUseCases.updateRemission(
            event.pathParameters.remissionId,
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
          body: JSON.stringify(updatedRemission),
        };
      }

      case DELETE: {
        if (!event.pathParameters || !event.pathParameters.remissionId) {
          return {
            statusCode: HTTP_BAD_REQUEST,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              message: "Remission ID is required in the path",
            }),
          };
        }

        const pathValidationResult = removeRemissionBody.safeParse({
          id: event.pathParameters.remissionId,
        });

        if (!pathValidationResult.success) {
          return {
            statusCode: HTTP_BAD_REQUEST,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              message: "Invalid or missing Remission ID",
              errors: pathValidationResult.error.issues,
            }),
          };
        }

        const remissionId = pathValidationResult.data.id;

        try {
          await remissionUseCases.removeRemission(remissionId);
          return {
            statusCode: HTTP_OK,
            body: JSON.stringify({
              id: remissionId,
              message: "Remission removed successfully",
            }),
          };
        } catch (error) {
          return {
            statusCode: HTTP_INTERNAL_SERVER_ERROR,
            body: JSON.stringify({
              message: "An error occurred while removing the remission",
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
