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
import { ProductGroupRepository } from "../../../persistence/repositories";
import { ProductGroupService } from "../../../../core/domain/services";
import { ProductGroupUseCases } from "../../../../core/application/use_cases";
import PoductBrandModel from "../../../persistence/models/ProductBrand.model";

const createProductGroupBodySchema = z.object({
  name: z.string(),
  productBrandId: z.string(), // FK → ProductBrand
  description: z.string().optional(),
  image: z.string().optional(),
});

const updateProductGroupBodySchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  productBrandId: z.string().optional(), // FK → ProductBrand
  description: z.string().optional(),
  image: z.string().optional(),
});

const removeProductGroupBody = z.object({
  id: z.string(),
});

const getProductGroupBody = z.object({
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
  const productRepository = new ProductGroupRepository();
  const productService = new ProductGroupService(productRepository);
  const productUseCases = new ProductGroupUseCases(productService);

  try {
    switch (event.requestContext.http.method) {
      case GET:
        if (event.pathParameters) {
          const pathValidationResult = getProductGroupBody.safeParse({
            id: event.pathParameters.productId,
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

          const products = await productUseCases.getProductGroup(
            pathValidationResult.data.id,
          );
          return {
            statusCode: HTTP_OK,
            body: JSON.stringify(products),
          };
        } else {
          // --- NUEVO: paginación, filtros y sort ---
          const query = event.queryStringParameters || {};
          const page = parseInt(query.page || "1", 10);
          const limit = parseInt(query.limit || "10", 10);

          // Extrae filtros (puedes personalizar los campos permitidos)
          const { sortBy, sortOrder, ...filters } = query;
          delete filters.page;
          delete filters.limit;

          // Obtén la consulta base desde el repositorio (debe ser un query de Mongoose)
          const baseQuery = productRepository.getQuery(); // Implementa este método en tu repo

          // Aplica filtros y paginación
          let queryWithFilters = baseQuery;
          Object.keys(filters).forEach((key) => {
            if (filters[key] !== undefined) {
              // Si el filtro es string, usa regex para coincidencia parcial (case-insensitive)
              if (typeof filters[key] === "string") {
                queryWithFilters = queryWithFilters.where(key, {
                  $regex: filters[key],
                  $options: "i",
                });
              } else {
                queryWithFilters = queryWithFilters.where(key, filters[key]);
              }
            }
          });

          // Aplica sort si se especifica
          if (sortBy) {
            const order = sortOrder === "desc" ? -1 : 1;
            queryWithFilters = queryWithFilters.sort({ [sortBy]: order });
          }

          // Total antes de paginar
          const total = await queryWithFilters.clone().countDocuments();

          // Paginación
          const offset = (page - 1) * limit;
          const docs = await queryWithFilters
            .limit(limit)
            .skip(offset)
            .populate({ path: "productBrandId", model: PoductBrandModel });
          const data = docs.map((doc: any) =>
            productRepository["docToEntity"](doc),
          );

          return {
            statusCode: HTTP_OK,
            body: JSON.stringify({ data, total, page, limit }),
          };
        }

      case POST: {
        const payload = JSON.parse(event.body ?? "{}");
        const validationResult =
          createProductGroupBodySchema.safeParse(payload);
        let newProductGroup;
        if (validationResult.success) {
          newProductGroup = await productUseCases.createProductGroup(payload);
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
          body: JSON.stringify(newProductGroup),
        };
      }

      case PATCH: {
        const payload = JSON.parse(event.body ?? "{}");
        let updatedProductGroup;

        if (!event.pathParameters || !event.pathParameters.productId) {
          return {
            statusCode: HTTP_BAD_REQUEST,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              message: "ProductGroup ID is required in the path",
            }),
          };
        }

        const validationResult = updateProductGroupBodySchema.safeParse({
          ...payload,
          id: event.pathParameters.productId,
        });

        if (validationResult.success) {
          updatedProductGroup = await productUseCases.updateProductGroup(
            event.pathParameters.productId,
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
          body: JSON.stringify(updatedProductGroup),
        };
      }

      case DELETE: {
        if (!event.pathParameters || !event.pathParameters.productId) {
          return {
            statusCode: HTTP_BAD_REQUEST,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              message: "ProductGroup ID is required in the path",
            }),
          };
        }

        const pathValidationResult = removeProductGroupBody.safeParse({
          id: event.pathParameters.productId,
        });

        if (!pathValidationResult.success) {
          return {
            statusCode: HTTP_BAD_REQUEST,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              message: "Invalid or missing ProductGroup ID",
              errors: pathValidationResult.error.issues,
            }),
          };
        }

        const productId = pathValidationResult.data.id;

        try {
          await productUseCases.removeProductGroup(productId);
          return {
            statusCode: HTTP_OK,
            body: JSON.stringify({
              id: productId,
              message: "ProductGroup removed successfully",
            }),
          };
        } catch (error) {
          return {
            statusCode: HTTP_INTERNAL_SERVER_ERROR,
            body: JSON.stringify({
              message: "An error occurred while removing the product",
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
