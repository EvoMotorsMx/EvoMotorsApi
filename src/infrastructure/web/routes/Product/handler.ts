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
import { ProductRepository } from "../../../persistence/repositories";
import { ProductService } from "../../../../core/domain/services";
import { ProductUseCases } from "../../../../core/application/use_cases";
import { ProductType } from "../../../../shared/enums";

const createProductBodySchema = z.object({
  name: z.string(),
  type: z.enum(Object.values(ProductType) as [string, ...string[]]),
  description: z.string().optional(),
  sku: z.string().optional(),
  productGroupId: z.string().optional(),
  systemType: z
    .enum(Object.values(ProductType) as [string, ...string[]])
    .optional(),
  stock: z.number().optional(),
  price: z.number().optional(),
  isComplement: z.boolean().optional(), // indica si es un complemento
  complementId: z.string().optional(), // FK → Product, puede ser nulo si no tiene complemento
});

const updateProductBodySchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  type: z.enum(Object.values(ProductType) as [string, ...string[]]).optional(),
  description: z.string().optional(),
  sku: z.string().optional(),
  productGroupId: z.string().optional(),
  systemType: z
    .enum(Object.values(ProductType) as [string, ...string[]])
    .optional(),
  stock: z.number().optional(),
  price: z.number().optional(),
  isComplement: z.boolean().optional(), // indica si es un complemento
  complementId: z.string().optional(), // FK → Product, puede ser nulo si no tiene complemento
});

const removeProductBody = z.object({
  id: z.string(),
});

const getProductBody = z.object({
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
  const productRepository = new ProductRepository();
  const productService = new ProductService(productRepository);
  const productUseCases = new ProductUseCases(productService);

  try {
    switch (event.requestContext.http.method) {
      case GET:
        if (event.pathParameters) {
          const pathValidationResult = getProductBody.safeParse({
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

          const products = await productUseCases.getProduct(
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
          const docs = await queryWithFilters.limit(limit).skip(offset);
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
        const validationResult = createProductBodySchema.safeParse(payload);
        let newProduct;
        if (validationResult.success) {
          newProduct = await productUseCases.createProduct(payload);
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
          body: JSON.stringify(newProduct),
        };
      }

      case PATCH: {
        const payload = JSON.parse(event.body ?? "{}");
        let updatedProduct;

        if (!event.pathParameters || !event.pathParameters.productId) {
          return {
            statusCode: HTTP_BAD_REQUEST,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              message: "Product ID is required in the path",
            }),
          };
        }

        const validationResult = updateProductBodySchema.safeParse({
          ...payload,
          id: event.pathParameters.productId,
        });

        if (validationResult.success) {
          updatedProduct = await productUseCases.updateProduct(
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
          body: JSON.stringify(updatedProduct),
        };
      }

      case DELETE: {
        if (!event.pathParameters || !event.pathParameters.productId) {
          return {
            statusCode: HTTP_BAD_REQUEST,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              message: "Product ID is required in the path",
            }),
          };
        }

        const pathValidationResult = removeProductBody.safeParse({
          id: event.pathParameters.productId,
        });

        if (!pathValidationResult.success) {
          return {
            statusCode: HTTP_BAD_REQUEST,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              message: "Invalid or missing Product ID",
              errors: pathValidationResult.error.issues,
            }),
          };
        }

        const productId = pathValidationResult.data.id;

        try {
          await productUseCases.removeProduct(productId);
          return {
            statusCode: HTTP_OK,
            body: JSON.stringify({
              id: productId,
              message: "Product removed successfully",
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
