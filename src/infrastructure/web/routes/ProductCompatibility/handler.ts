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
import ProductModel from "../../../persistence/models/Product.model";
import CarModelModel from "../../../persistence/models/CarModel.model";
import ProductGroupModel from "../../../persistence/models/ProductGroup.model";
import ProductBrandModel from "../../../persistence/models/ProductBrand.model";
import BrandModel from "../../../persistence/models/Brand.model";

const createProductCompatibilityBodySchema = z.object({
  productId: z.string(),
  carModelId: z.string(),
  endHp: z.number().optional(), // Optional field for end horsepower
  endTorque: z.number().optional(), // Optional field for end torque
  vMax: z.string().optional(), // Optional field for maximum speed
  priceOverride: z.number().optional(), // Optional field for price override
  priceAdditional: z.number().optional(), // Optional field for additional price
  notes: z.string().optional(), // Optional field for notes
  description: z.string().optional(), // Optional field for description
  complementId: z.string().optional(), // Optional field for complement product ID
});

const updateProductCompatibilityBodySchema = z.object({
  id: z.string(),
  productId: z.string(),
  carModelId: z.string(),
  endHp: z.number().optional(), // Optional field for end horsepower
  endTorque: z.number().optional(), // Optional field for end torque
  vMax: z.string().optional(), // Optional field for maximum speed
  priceOverride: z.number().optional(), // Optional field for price override
  priceAdditional: z.number().optional(), // Optional field for additional price
  notes: z.string().optional(), // Optional field for notes
  description: z.string().optional(), // Optional field for description
  complementId: z.string().optional(), // Optional field for complement product ID
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
          // --- NUEVO: paginación, filtros y sort ---
          const query = event.queryStringParameters || {};
          const page = parseInt(query.page || "1", 10);
          const limit = parseInt(query.limit || "10", 10);

          // Extrae filtros (puedes personalizar los campos permitidos)
          const { sortBy, sortOrder, ...filters } = query;
          delete filters.page;
          delete filters.limit;

          // Obtén la consulta base desde el repositorio (debe ser un query de Mongoose)
          const baseQuery = productCompatibilityRepository.getQuery(); // Implementa este método en tu repo

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
            .populate({
              path: "product",
              model: ProductModel,
              populate: {
                path: "productGroupId",
                model: ProductGroupModel,
                populate: { path: "productBrandId", model: ProductBrandModel },
              },
            })
            .populate({
              path: "carModel",
              model: CarModelModel,
              populate: { path: "brandId", model: BrandModel },
            })
            .populate({
              path: "complementId",
              model: ProductModel,
              populate: {
                path: "productGroupId",
                model: ProductGroupModel,
                populate: { path: "productBrandId", model: ProductBrandModel },
              },
            });
          const data = docs.map((doc: any) =>
            productCompatibilityRepository["docToEntity"](doc),
          );

          return {
            statusCode: HTTP_OK,
            body: JSON.stringify({ data, total, page, limit }),
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
