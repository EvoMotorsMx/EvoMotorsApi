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
import { ProductCompatibilityRepository } from "../../../persistence/repositories";
import { ProductCompatibilityService } from "../../../../core/domain/services";
import { ProductCompatibilityUseCases } from "../../../../core/application/use_cases";

const createProductCompatibilityBodySchema = z.object({
  productId: z.string(),
  carModelId: z.string(),
});

const updateProductCompatibilityBodySchema = z.object({
  id: z.string(),
  productId: z.string(),
  carModelId: z.string(),
});

const removeProductCompatibilityBody = z.object({
  id: z.string(),
});

const getProductCompatibilityBody = z.object({
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
  const productCompatibilityRepository = new ProductCompatibilityRepository();
  const productCompatibilityService = new ProductCompatibilityService(
    productCompatibilityRepository,
  );
  const productCompatibilityUseCases = new ProductCompatibilityUseCases(
    productCompatibilityService,
  );

  try {
    switch (event.requestContext.http.method) {
      case GET:
        if (event.pathParameters) {
          const pathValidationResult = getProductCompatibilityBody.safeParse({
            id: event.pathParameters.productCompatibilityId,
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

          const productCompatibilities =
            await productCompatibilityUseCases.getProductCompatibility(
              pathValidationResult.data.id,
            );
          return {
            statusCode: HTTP_OK,
            body: JSON.stringify(productCompatibilities),
          };
        } else {
          const productCompatibilities =
            await productCompatibilityUseCases.findAllProductCompatibilities();
          return {
            statusCode: HTTP_OK,
            body: JSON.stringify(productCompatibilities),
          };
        }

      case POST: {
        const payload = JSON.parse(event.body ?? "{}");
        const validationResult =
          createProductCompatibilityBodySchema.safeParse(payload);
        let newProductCompatibility;
        if (validationResult.success) {
          newProductCompatibility =
            await productCompatibilityUseCases.createProductCompatibility(
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
          statusCode: HTTP_CREATED,
          body: JSON.stringify(newProductCompatibility),
        };
      }

      case PATCH: {
        const payload = JSON.parse(event.body ?? "{}");
        let updatedProductCompatibility;

        if (
          !event.pathParameters ||
          !event.pathParameters.productCompatibilityId
        ) {
          return {
            statusCode: HTTP_BAD_REQUEST,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              message: "ProductCompatibility ID is required in the path",
            }),
          };
        }

        const validationResult = updateProductCompatibilityBodySchema.safeParse(
          {
            ...payload,
            id: event.pathParameters.productCompatibilityId,
          },
        );

        if (validationResult.success) {
          updatedProductCompatibility =
            await productCompatibilityUseCases.updateProductCompatibility(
              event.pathParameters.productCompatibilityId,
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
          body: JSON.stringify(updatedProductCompatibility),
        };
      }

      case DELETE: {
        if (
          !event.pathParameters ||
          !event.pathParameters.productCompatibilityId
        ) {
          return {
            statusCode: HTTP_BAD_REQUEST,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              message: "ProductCompatibility ID is required in the path",
            }),
          };
        }

        const pathValidationResult = removeProductCompatibilityBody.safeParse({
          id: event.pathParameters.productCompatibilityId,
        });

        if (!pathValidationResult.success) {
          return {
            statusCode: HTTP_BAD_REQUEST,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              message: "Invalid or missing ProductCompatibility ID",
              errors: pathValidationResult.error.issues,
            }),
          };
        }

        const productCompatibilityId = pathValidationResult.data.id;

        try {
          await productCompatibilityUseCases.removeProductCompatibility(
            productCompatibilityId,
          );
          return {
            statusCode: HTTP_OK,
            body: JSON.stringify({
              id: productCompatibilityId,
              message: "ProductCompatibility removed successfully",
            }),
          };
        } catch (error) {
          return {
            statusCode: HTTP_INTERNAL_SERVER_ERROR,
            body: JSON.stringify({
              message:
                "An error occurred while removing the productCompatibility",
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
