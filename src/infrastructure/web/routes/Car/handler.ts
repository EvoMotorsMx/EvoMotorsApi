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
import { CarRepository } from "../../../persistence/repositories/CarRepository";
import { decodeToken } from "../../../../shared/utils/userDecoder";
import { CUSTOMER_ROLE } from "../../../../shared/constants/roles";
import { IIdToken } from "../../../security/Auth";
import { CombustionType, EngineType } from "../../../../shared/enums";
import { CarService } from "../../../../core/domain/services";
import { CarUseCases } from "../../../../core/application/use_cases";

const createCarBodySchema = z.object({
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

const updateCarBodySchema = z.object({
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

const removeCarBody = z.object({
  id: z.string(),
});

const getCarBody = z.object({
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
  const carRepository = new CarRepository();
  const carService = new CarService(carRepository);
  const carUseCases = new CarUseCases(carService);

  try {
    switch (event.requestContext.http.method) {
      case GET:
        if (event.pathParameters) {
          const pathValidationResult = getCarBody.safeParse({
            id: event.pathParameters.carId,
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

          const cars = await carUseCases.getCar(pathValidationResult.data.id);
          return {
            statusCode: HTTP_OK,
            body: JSON.stringify(cars),
          };
        } else {
          const cars = await carUseCases.findAllCars();
          return {
            statusCode: HTTP_OK,
            body: JSON.stringify(cars),
          };
        }

      case POST: {
        const payload = JSON.parse(event.body ?? "{}");
        const validationResult = createCarBodySchema.safeParse(payload);
        let newCar;
        if (validationResult.success) {
          newCar = await carUseCases.createCar(payload);
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
          body: JSON.stringify(newCar),
        };
      }

      case PATCH: {
        const payload = JSON.parse(event.body ?? "{}");
        let updatedCar;

        if (!event.pathParameters || !event.pathParameters.carId) {
          return {
            statusCode: HTTP_BAD_REQUEST,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              message: "Car ID is required in the path",
            }),
          };
        }

        const validationResult = updateCarBodySchema.safeParse({
          ...payload,
          id: event.pathParameters.carId,
        });

        if (validationResult.success) {
          updatedCar = await carUseCases.updateCar(
            event.pathParameters.carId,
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
          body: JSON.stringify(updatedCar),
        };
      }

      case DELETE: {
        if (!event.pathParameters || !event.pathParameters.carId) {
          return {
            statusCode: HTTP_BAD_REQUEST,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              message: "Car ID is required in the path",
            }),
          };
        }

        const pathValidationResult = removeCarBody.safeParse({
          id: event.pathParameters.carId,
        });

        if (!pathValidationResult.success) {
          return {
            statusCode: HTTP_BAD_REQUEST,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              message: "Invalid or missing Car ID",
              errors: pathValidationResult.error.issues,
            }),
          };
        }

        const carId = pathValidationResult.data.id;

        try {
          await carUseCases.removeCar(carId);
          return {
            statusCode: HTTP_OK,
            body: JSON.stringify({
              id: carId,
              message: "Car removed successfully",
            }),
          };
        } catch (error) {
          return {
            statusCode: HTTP_INTERNAL_SERVER_ERROR,
            body: JSON.stringify({
              message: "An error occurred while removing the car",
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