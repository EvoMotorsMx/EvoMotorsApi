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
import { ProductBrandRepository } from "../../../persistence/repositories";
import { ProductBrandService } from "../../../../core/domain/services";
import { ProductBrandUseCases } from "../../../../core/application/use_cases";

const createProductBrandBodySchema = z.object({
  name: z.string(),
  logo: z.string().optional(), // Optional logo for the product brand
  description: z.string().optional(), // Optional description for the product brand
});

const updateProductBrandBodySchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  logo: z.string().optional(), // Optional logo for the product brand
  description: z.string().optional(), // Optional description for the product brand
});

const removeProductBrandBody = z.object({
  id: z.string(),
});

const getProductBrandBody = z.object({
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
  const productBrandRepository = new ProductBrandRepository();
  const productBrandService = new ProductBrandService(productBrandRepository);
  const productBrandUseCases = new ProductBrandUseCases(productBrandService);

  try {
    switch (event.requestContext.http.method) {
      case GET:
        if (event.pathParameters) {
          const pathValidationResult = getProductBrandBody.safeParse({
            id: event.pathParameters.productBrandId,
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

          const productBrands = await productBrandUseCases.getProductBrand(
            pathValidationResult.data.id,
          );
          return {
            statusCode: HTTP_OK,
            body: JSON.stringify(productBrands),
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
          const baseQuery = productBrandRepository.getQuery(); // Implementa este método en tu repo

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
            productBrandRepository["docToEntity"](doc),
          );

          return {
            statusCode: HTTP_OK,
            body: JSON.stringify({ data, total, page, limit }),
          };
        }

      case POST: {
        const payload = JSON.parse(event.body ?? "{}");
        const validationResult =
          createProductBrandBodySchema.safeParse(payload);
        let newProductBrand;
        if (validationResult.success) {
          newProductBrand =
            await productBrandUseCases.createProductBrand(payload);
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
          body: JSON.stringify(newProductBrand),
        };
      }

      case PATCH: {
        const payload = JSON.parse(event.body ?? "{}");
        let updatedProductBrand;

        if (!event.pathParameters || !event.pathParameters.productBrandId) {
          return {
            statusCode: HTTP_BAD_REQUEST,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              message: "ProductBrand ID is required in the path",
            }),
          };
        }

        const validationResult = updateProductBrandBodySchema.safeParse({
          ...payload,
          id: event.pathParameters.productBrandId,
        });

        if (validationResult.success) {
          updatedProductBrand = await productBrandUseCases.updateProductBrand(
            event.pathParameters.productBrandId,
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
          body: JSON.stringify(updatedProductBrand),
        };
      }

      case DELETE: {
        if (!event.pathParameters || !event.pathParameters.productBrandId) {
          return {
            statusCode: HTTP_BAD_REQUEST,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              message: "ProductBrand ID is required in the path",
            }),
          };
        }

        const pathValidationResult = removeProductBrandBody.safeParse({
          id: event.pathParameters.productBrandId,
        });

        if (!pathValidationResult.success) {
          return {
            statusCode: HTTP_BAD_REQUEST,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              message: "Invalid or missing ProductBrand ID",
              errors: pathValidationResult.error.issues,
            }),
          };
        }

        const productBrandId = pathValidationResult.data.id;

        try {
          await productBrandUseCases.removeProductBrand(productBrandId);
          return {
            statusCode: HTTP_OK,
            body: JSON.stringify({
              id: productBrandId,
              message: "ProductBrand removed successfully",
            }),
          };
        } catch (error) {
          return {
            statusCode: HTTP_INTERNAL_SERVER_ERROR,
            body: JSON.stringify({
              message: "An error occurred while removing the productBrand",
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
