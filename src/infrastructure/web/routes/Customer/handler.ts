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
import { CustomerRepository } from "../../../persistence/repositories";
import { CarService, CustomerService } from "../../../../core/domain/services";
import { CustomerUseCases } from "../../../../core/application/use_cases";
import { ContactType } from "../../../../shared/enums";

const createCustomerBodySchema = z.object({
  name: z.string(),
  lastName: z.string(),
  city: z.string(),
  state: z.string(),
  country: z.string(),
  phone: z.string(),
  email: z.string(),
  rfc: z.string().optional(),
  razonSocial: z.string().optional(),
  contacto: z.nativeEnum(ContactType),
  remissions: z.array(z.string()).optional(),
  cars: z.array(z.string()).optional(),
  company: z.string().optional(),
});

const updateCustomerBodySchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  lastName: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().optional(),
  rfc: z.string().optional(),
  razonSocial: z.string().optional(),
  contacto: z.nativeEnum(ContactType).optional(),
  remissions: z.array(z.string()).optional(),
  cars: z.array(z.string()).optional(),
  company: z.string().optional(),
});

const removeCustomerBody = z.object({
  id: z.string(),
});

const getCustomerBody = z.object({
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
  const customerRepository = new CustomerRepository();
  const customerService = new CustomerService(customerRepository);
  const customerUseCases = new CustomerUseCases(customerService);

  try {
    switch (event.requestContext.http.method) {
      case GET:
        if (event.pathParameters) {
          const pathValidationResult = getCustomerBody.safeParse({
            id: event.pathParameters.customerId,
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

          const customers = await customerUseCases.getCustomer(
            pathValidationResult.data.id,
          );
          return {
            statusCode: HTTP_OK,
            body: JSON.stringify(customers),
          };
        } else {
          const customers = await customerUseCases.findAllCustomers();
          return {
            statusCode: HTTP_OK,
            body: JSON.stringify(customers),
          };
        }

      case POST: {
        const payload = JSON.parse(event.body ?? "{}");
        const validationResult = createCustomerBodySchema.safeParse(payload);
        let newCustomer;
        if (validationResult.success) {
          newCustomer = await customerUseCases.createCustomer(payload);
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
          body: JSON.stringify(newCustomer),
        };
      }

      case PATCH: {
        const payload = JSON.parse(event.body ?? "{}");
        let updatedCustomer;

        if (!event.pathParameters || !event.pathParameters.customerId) {
          return {
            statusCode: HTTP_BAD_REQUEST,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              message: "Customer ID is required in the path",
            }),
          };
        }

        const validationResult = updateCustomerBodySchema.safeParse({
          ...payload,
          id: event.pathParameters.customerId,
        });

        if (validationResult.success) {
          updatedCustomer = await customerUseCases.updateCustomer(
            event.pathParameters.customerId,
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
          body: JSON.stringify(updatedCustomer),
        };
      }

      case DELETE: {
        if (!event.pathParameters || !event.pathParameters.customerId) {
          return {
            statusCode: HTTP_BAD_REQUEST,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              message: "Customer ID is required in the path",
            }),
          };
        }

        const pathValidationResult = removeCustomerBody.safeParse({
          id: event.pathParameters.customerId,
        });

        if (!pathValidationResult.success) {
          return {
            statusCode: HTTP_BAD_REQUEST,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              message: "Invalid or missing Customer ID",
              errors: pathValidationResult.error.issues,
            }),
          };
        }

        const customerId = pathValidationResult.data.id;

        try {
          await customerUseCases.removeCustomer(customerId);
          return {
            statusCode: HTTP_OK,
            body: JSON.stringify({
              id: customerId,
              message: "Customer removed successfully",
            }),
          };
        } catch (error) {
          return {
            statusCode: HTTP_INTERNAL_SERVER_ERROR,
            body: JSON.stringify({
              message: "An error occurred while removing the customer",
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
