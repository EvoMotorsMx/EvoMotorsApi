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
import { ProductPriceRepository } from "../../../persistence/repositories";
import { ProductPriceService } from "../../../../core/domain/services";
import { ProductPriceUseCases } from "../../../../core/application/use_cases";

const createProductPricePriceBodySchema = z.object({
  carModelId: z.string(),
  productId: z.string(),
  price: z.number(),
  hpIncrement: z.number(),
  torqueIncrement: z.number(),
});

const updateProductPricePriceBodySchema = z.object({
  id: z.string(),
  carModelId: z.string().optional(),
  productId: z.string().optional(),
  price: z.string().optional(),
  hpIncrement: z.number(),
  torqueIncrement: z.number(),
});

const removeProductPricePriceBody = z.object({
  id: z.string(),
});

const getProductPricePriceBody = z.object({
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
  const productPriceRepository = new ProductPriceRepository();
  const productPriceService = new ProductPriceService(productPriceRepository);
  const productService = new ProductPriceUseCases(productPriceService);

  try {
    switch (event.requestContext.http.method) {
      case GET:
        if (event.pathParameters) {
          const pathValidationResult = getProductPricePriceBody.safeParse({
            id: event.pathParameters.productPricePriceId,
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

          const productPricePrices = await productService.getProductPrice(
            pathValidationResult.data.id,
          );
          return {
            statusCode: HTTP_OK,
            body: JSON.stringify(productPricePrices),
          };
        } else {
          const productPricePrices =
            await productService.findAllProductPrices();
          return {
            statusCode: HTTP_OK,
            body: JSON.stringify(productPricePrices),
          };
        }

      case POST: {
        const payload = JSON.parse(event.body ?? "{}");
        const validationResult =
          createProductPricePriceBodySchema.safeParse(payload);
        let newProductPricePrice;
        if (validationResult.success) {
          newProductPricePrice =
            await productService.createProductPrice(payload);
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
          body: JSON.stringify(newProductPricePrice),
        };
      }

      case PATCH: {
        const payload = JSON.parse(event.body ?? "{}");
        let updatedProductPricePrice;

        if (
          !event.pathParameters ||
          !event.pathParameters.productPricePriceId
        ) {
          return {
            statusCode: HTTP_BAD_REQUEST,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              message: "Product Price ID is required in the path",
            }),
          };
        }

        const validationResult = updateProductPricePriceBodySchema.safeParse({
          ...payload,
          id: event.pathParameters.productPricePriceId,
        });

        if (validationResult.success) {
          updatedProductPricePrice = await productService.updateProductPrice(
            event.pathParameters.productPricePriceId,
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
          body: JSON.stringify(updatedProductPricePrice),
        };
      }

      case DELETE: {
        if (
          !event.pathParameters ||
          !event.pathParameters.productPricePriceId
        ) {
          return {
            statusCode: HTTP_BAD_REQUEST,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              message: "Product Price ID is required in the path",
            }),
          };
        }

        const pathValidationResult = removeProductPricePriceBody.safeParse({
          id: event.pathParameters.productPricePriceId,
        });

        if (!pathValidationResult.success) {
          return {
            statusCode: HTTP_BAD_REQUEST,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              message: "Invalid or missing Product Price ID",
              errors: pathValidationResult.error.issues,
            }),
          };
        }

        const productPricePriceId = pathValidationResult.data.id;

        try {
          await productService.removeProductPrice(productPricePriceId);
          return {
            statusCode: HTTP_OK,
            body: JSON.stringify({
              id: productPricePriceId,
              message: "Product Price removed successfully",
            }),
          };
        } catch (error) {
          return {
            statusCode: HTTP_INTERNAL_SERVER_ERROR,
            body: JSON.stringify({
              message: "An error occurred while removing the product price",
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
