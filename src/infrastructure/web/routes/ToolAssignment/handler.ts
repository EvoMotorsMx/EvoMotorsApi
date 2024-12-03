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
import {
  ToolAssignmentRepository,
  ToolRepository,
} from "../../../persistence/repositories";
import {
  ToolAssignmentService,
  ToolService,
} from "../../../../core/domain/services";
import { ToolAssignmentUseCases } from "../../../../core/application/use_cases";

const createToolAssignmentBodySchema = z.object({
  name: z.string(),
  totalQuantity: z.number(),
  description: z.string().optional(),
});

const updateToolAssignmentBodySchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  totalQuantity: z.number().optional(),
  description: z.string().optional(),
});

const removeToolAssignmentBody = z.object({
  id: z.string(),
});

const getToolAssignmentBody = z.object({
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
  const toolAssignmentRepository = new ToolAssignmentRepository();
  const toolAssignmentService = new ToolAssignmentService(
    toolAssignmentRepository,
  );
  const toolRepository = new ToolRepository();
  const toolService = new ToolService(toolRepository);
  const toolAssignmentUseCases = new ToolAssignmentUseCases(
    toolAssignmentService,
    toolService,
  );

  try {
    switch (event.requestContext.http.method) {
      case GET:
        if (event.pathParameters) {
          const pathValidationResult = getToolAssignmentBody.safeParse({
            id: event.pathParameters.toolAssignmentId,
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

          const toolAssignments =
            await toolAssignmentUseCases.getToolAssignment(
              pathValidationResult.data.id,
            );
          return {
            statusCode: HTTP_OK,
            body: JSON.stringify(toolAssignments),
          };
        } else {
          const toolAssignments =
            await toolAssignmentUseCases.findAllToolAssignments();
          return {
            statusCode: HTTP_OK,
            body: JSON.stringify(toolAssignments),
          };
        }

      case POST: {
        const payload = JSON.parse(event.body ?? "{}");
        const validationResult =
          createToolAssignmentBodySchema.safeParse(payload);
        let newToolAssignment;
        if (validationResult.success) {
          newToolAssignment =
            await toolAssignmentUseCases.createToolAssignment(payload);
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
          body: JSON.stringify(newToolAssignment),
        };
      }

      case PATCH: {
        const payload = JSON.parse(event.body ?? "{}");
        let updatedToolAssignment;

        if (!event.pathParameters || !event.pathParameters.toolAssignmentId) {
          return {
            statusCode: HTTP_BAD_REQUEST,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              message: "ToolAssignment ID is required in the path",
            }),
          };
        }

        const validationResult = updateToolAssignmentBodySchema.safeParse({
          ...payload,
          id: event.pathParameters.toolAssignmentId,
        });

        if (validationResult.success) {
          updatedToolAssignment =
            await toolAssignmentUseCases.updateToolAssignment(
              event.pathParameters.toolAssignmentId,
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
          body: JSON.stringify(updatedToolAssignment),
        };
      }

      case DELETE: {
        if (!event.pathParameters || !event.pathParameters.toolAssignmentId) {
          return {
            statusCode: HTTP_BAD_REQUEST,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              message: "ToolAssignment ID is required in the path",
            }),
          };
        }

        const pathValidationResult = removeToolAssignmentBody.safeParse({
          id: event.pathParameters.toolAssignmentId,
        });

        if (!pathValidationResult.success) {
          return {
            statusCode: HTTP_BAD_REQUEST,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              message: "Invalid or missing ToolAssignment ID",
              errors: pathValidationResult.error.issues,
            }),
          };
        }

        const toolAssignmentId = pathValidationResult.data.id;

        try {
          await toolAssignmentUseCases.removeToolAssignment(toolAssignmentId);
          return {
            statusCode: HTTP_OK,
            body: JSON.stringify({
              id: toolAssignmentId,
              message: "ToolAssignment removed successfully",
            }),
          };
        } catch (error) {
          return {
            statusCode: HTTP_INTERNAL_SERVER_ERROR,
            body: JSON.stringify({
              message: "An error occurred while removing the toolAssignment",
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
