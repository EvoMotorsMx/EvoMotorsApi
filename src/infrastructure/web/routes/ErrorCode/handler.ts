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
import { ErrorCodeRepository } from "../../../persistence/repositories";
import { ErrorCodeService } from "../../../../core/domain/services";
import { ErrorCodeUseCases } from "../../../../core/application/use_cases";

const createErrorCodeBodySchema = z.object({
  name: z.string(),
  code: z.string(),
  description: z.string().optional(),
  brand: z.string(),
});

const updateErrorCodeBodySchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  code: z.string().optional(),
  description: z.string().optional(),
});

const removeErrorCodeBody = z.object({
  id: z.string(),
});

const getErrorCodeBody = z.object({
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
  const errorCodeRepository = new ErrorCodeRepository();
  const errorCodeService = new ErrorCodeService(errorCodeRepository);
  const errorCodeUseCases = new ErrorCodeUseCases(errorCodeService);

  try {
    switch (event.requestContext.http.method) {
      case GET:
        if (event.pathParameters) {
          const pathValidationResult = getErrorCodeBody.safeParse({
            id: event.pathParameters.errorCodeId,
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

          const errorCodes = await errorCodeUseCases.getErrorCode(
            pathValidationResult.data.id,
          );
          return {
            statusCode: HTTP_OK,
            body: JSON.stringify(errorCodes),
          };
        } else {
          const errorCodes = await errorCodeUseCases.findAllErrorCodes();
          return {
            statusCode: HTTP_OK,
            body: JSON.stringify(errorCodes),
          };
        }

      case POST: {
        const payload = JSON.parse(event.body ?? "{}");
        const validationResult = createErrorCodeBodySchema.safeParse(payload);
        let newErrorCode;
        if (validationResult.success) {
          newErrorCode = await errorCodeUseCases.createErrorCode(payload);
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
          body: JSON.stringify(newErrorCode),
        };
      }

      case PATCH: {
        const payload = JSON.parse(event.body ?? "{}");
        let updatedErrorCode;

        if (!event.pathParameters || !event.pathParameters.errorCodeId) {
          return {
            statusCode: HTTP_BAD_REQUEST,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              message: "ErrorCode ID is required in the path",
            }),
          };
        }

        const validationResult = updateErrorCodeBodySchema.safeParse({
          ...payload,
          id: event.pathParameters.errorCodeId,
        });

        if (validationResult.success) {
          updatedErrorCode = await errorCodeUseCases.updateErrorCode(
            event.pathParameters.errorCodeId,
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
          body: JSON.stringify(updatedErrorCode),
        };
      }

      case DELETE: {
        if (!event.pathParameters || !event.pathParameters.errorCodeId) {
          return {
            statusCode: HTTP_BAD_REQUEST,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              message: "ErrorCode ID is required in the path",
            }),
          };
        }

        const pathValidationResult = removeErrorCodeBody.safeParse({
          id: event.pathParameters.errorCodeId,
        });

        if (!pathValidationResult.success) {
          return {
            statusCode: HTTP_BAD_REQUEST,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              message: "Invalid or missing ErrorCode ID",
              errors: pathValidationResult.error.issues,
            }),
          };
        }

        const errorCodeId = pathValidationResult.data.id;

        try {
          await errorCodeUseCases.removeErrorCode(errorCodeId);
          return {
            statusCode: HTTP_OK,
            body: JSON.stringify({
              id: errorCodeId,
              message: "ErrorCode removed successfully",
            }),
          };
        } catch (error) {
          return {
            statusCode: HTTP_INTERNAL_SERVER_ERROR,
            body: JSON.stringify({
              message: "An error occurred while removing the errorCode",
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
