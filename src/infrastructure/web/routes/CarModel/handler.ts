import {
  APIGatewayProxyEventV2,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";
import { connectToDatabase } from "../../../../shared/utils/db-connection";
import { CarModelService } from "../../../../core/domain/services/CarModelService";
import { CarModelUseCases } from "../../../../core/application/use_cases/CarModelUseCases";
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
import { CarModelRepository } from "../../../persistence/repositories/CarModelRepository";
import { decodeToken } from "../../../../shared/utils/userDecoder";
import { CUSTOMER_ROLE } from "../../../../shared/constants/roles";
import { IIdToken } from "../../../security/Auth";
import { CombustionType, EngineType } from "../../../../shared/enums";

const createCarModelBodySchema = z.object({
  name: z.string(),
  brandId: z.string(),
  year: z
    .array(z.string().regex(/^\d{4}$/, "Year must be a four-digit number"))
    .optional(),
  engineSize: z.string(),
  cylinder: z.number().positive(),
  combustion: z.nativeEnum(CombustionType),
  engineType: z.nativeEnum(EngineType),
  files: z.array(z.string()).optional(),
  products: z.array(z.string()).optional(),
});

const updateCarModelBodySchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  brandId: z.string().optional(),
  year: z
    .array(z.string().regex(/^\d{4}$/, "Year must be a four-digit number"))
    .optional(),
  engineSize: z.string().optional(),
  cylinder: z.number().positive().optional(),
  combustion: z.nativeEnum(CombustionType).optional(),
  engineType: z.nativeEnum(EngineType).optional(),
  files: z.array(z.string()).optional(),
  products: z.array(z.string()).optional(),
});

const removeCarModelBody = z.object({
  id: z.string(),
});

const getCarModelBody = z.object({
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
  const carModelRepository = new CarModelRepository();
  const carModelService = new CarModelService(carModelRepository);
  const carModelUseCases = new CarModelUseCases(carModelService);

  try {
    switch (event.requestContext.http.method) {
      case GET:
        if (event.pathParameters) {
          const pathValidationResult = getCarModelBody.safeParse({
            id: event.pathParameters.carModelId,
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

          const carModel = await carModelUseCases.getCarModel(
            pathValidationResult.data.id,
          );
          return {
            statusCode: HTTP_OK,
            body: JSON.stringify(carModel),
          };
        } else {
          const carModels = await carModelUseCases.findAllCarModels();
          return {
            statusCode: HTTP_OK,
            body: JSON.stringify(carModels),
          };
        }

      case POST: {
        const payload = JSON.parse(event.body ?? "{}");
        const validationResult = createCarModelBodySchema.safeParse(payload);
        let newCarModel;
        if (validationResult.success) {
          newCarModel = await carModelUseCases.createCarModel(payload);
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
          body: JSON.stringify(newCarModel),
        };
      }

      case PATCH: {
        const payload = JSON.parse(event.body ?? "{}");
        let updatedCarModel;

        if (!event.pathParameters || !event.pathParameters.carModelId) {
          return {
            statusCode: HTTP_BAD_REQUEST,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              message: "Car Model ID is required in the path",
            }),
          };
        }

        const validationResult = updateCarModelBodySchema.safeParse({
          ...payload,
          id: event.pathParameters.carModelId,
        });

        if (validationResult.success) {
          updatedCarModel = await carModelUseCases.updateCarModel(
            event.pathParameters.carModelId,
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
          body: JSON.stringify(updatedCarModel),
        };
      }

      case DELETE: {
        if (!event.pathParameters || !event.pathParameters.carModelId) {
          return {
            statusCode: HTTP_BAD_REQUEST,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              message: "Car Model ID is required in the path",
            }),
          };
        }

        const pathValidationResult = removeCarModelBody.safeParse({
          id: event.pathParameters.carModelId,
        });

        if (!pathValidationResult.success) {
          return {
            statusCode: HTTP_BAD_REQUEST,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              message: "Invalid or missing Car Model ID",
              errors: pathValidationResult.error.issues,
            }),
          };
        }

        const carModelId = pathValidationResult.data.id;

        try {
          await carModelUseCases.removeCarModel(carModelId);
          return {
            statusCode: HTTP_OK,
            body: JSON.stringify({
              id: carModelId,
              message: "Car Model removed successfully",
            }),
          };
        } catch (error) {
          return {
            statusCode: HTTP_INTERNAL_SERVER_ERROR,
            body: JSON.stringify({
              message: "An error occurred while removing the car model",
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
