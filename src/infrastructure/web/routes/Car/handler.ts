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
import { CarService, CustomerService } from "../../../../core/domain/services";
import { CarUseCases } from "../../../../core/application/use_cases";
import { CustomerRepository } from "../../../persistence/repositories";

const createCarBodySchema = z.object({
  vin: z.string(),
  plates: z.string(),
  carModelId: z.string(),
  customerId: z.string(),
  certificateId: z.string().optional(),
  remissions: z.array(z.string()).optional(),
  errorCodes: z.array(z.string()).optional(),
  files: z.array(z.string()).optional(),
});

const updateCarBodySchema = z.object({
  vin: z.string().optional(),
  plates: z.string().optional(),
  carModelId: z.string().optional(),
  customerId: z.string().optional(),
  certificateId: z.string().optional(),
  remissions: z.array(z.string()).optional(),
  errorCodes: z.array(z.string()).optional(),
  files: z.array(z.string()).optional(),
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

  const customerRepository = new CustomerRepository();
  const customerService = new CustomerService(customerRepository);

  const carUseCases = new CarUseCases(carService, customerService);

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
              errors: validationResult.error.errors,
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
