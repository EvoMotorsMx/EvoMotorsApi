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
import { ToolRepository } from "../../../persistence/repositories";
import { ToolService } from "../../../../core/domain/services";
import { ToolUseCases } from "../../../../core/application/use_cases";

const createToolBodySchema = z.object({
  name: z.string(),
  totalQuantity: z.number(),
  description: z.string().optional(),
});

const updateToolBodySchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  totalQuantity: z.number().optional(),
  description: z.string().optional(),
});

const removeToolBody = z.object({
  id: z.string(),
});

const getToolBody = z.object({
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
  const toolRepository = new ToolRepository();
  const toolService = new ToolService(toolRepository);
  const toolUseCases = new ToolUseCases(toolService);

  try {
    switch (event.requestContext.http.method) {
      case GET:
        if (event.pathParameters) {
          const pathValidationResult = getToolBody.safeParse({
            id: event.pathParameters.toolId,
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

          const tools = await toolUseCases.getTool(
            pathValidationResult.data.id,
          );
          return {
            statusCode: HTTP_OK,
            body: JSON.stringify(tools),
          };
        } else {
          const tools = await toolUseCases.findAllTools();
          return {
            statusCode: HTTP_OK,
            body: JSON.stringify(tools),
          };
        }

      case POST: {
        const payload = JSON.parse(event.body ?? "{}");
        const validationResult = createToolBodySchema.safeParse(payload);
        let newTool;
        if (validationResult.success) {
          newTool = await toolUseCases.createTool(payload);
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
          body: JSON.stringify(newTool),
        };
      }

      case PATCH: {
        const payload = JSON.parse(event.body ?? "{}");
        let updatedTool;

        if (!event.pathParameters || !event.pathParameters.toolId) {
          return {
            statusCode: HTTP_BAD_REQUEST,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              message: "Tool ID is required in the path",
            }),
          };
        }

        const validationResult = updateToolBodySchema.safeParse({
          ...payload,
          id: event.pathParameters.toolId,
        });

        if (validationResult.success) {
          updatedTool = await toolUseCases.updateTool(
            event.pathParameters.toolId,
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
          body: JSON.stringify(updatedTool),
        };
      }

      case DELETE: {
        if (!event.pathParameters || !event.pathParameters.toolId) {
          return {
            statusCode: HTTP_BAD_REQUEST,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              message: "Tool ID is required in the path",
            }),
          };
        }

        const pathValidationResult = removeToolBody.safeParse({
          id: event.pathParameters.toolId,
        });

        if (!pathValidationResult.success) {
          return {
            statusCode: HTTP_BAD_REQUEST,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              message: "Invalid or missing Tool ID",
              errors: pathValidationResult.error.issues,
            }),
          };
        }

        const toolId = pathValidationResult.data.id;

        try {
          await toolUseCases.removeTool(toolId);
          return {
            statusCode: HTTP_OK,
            body: JSON.stringify({
              id: toolId,
              message: "Tool removed successfully",
            }),
          };
        } catch (error) {
          return {
            statusCode: HTTP_INTERNAL_SERVER_ERROR,
            body: JSON.stringify({
              message: "An error occurred while removing the tool",
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
