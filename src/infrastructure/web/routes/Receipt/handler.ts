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
import { ReceiptRepository } from "../../../persistence/repositories/ReceiptRepository";
import { decodeToken } from "../../../../shared/utils/userDecoder";
import { CUSTOMER_ROLE } from "../../../../shared/constants/roles";
import { IIdToken } from "../../../security/Auth";
import { ReceiptService } from "../../../../core/domain/services";
import { ReceiptUseCases } from "../../../../core/application/use_cases";

const createReceiptBodySchema = z.object({
  installationEndDate: z.date().optional(),
  signImage: z.string(),
  installationStatus: z.enum(["pending", "completed"]),
  tankStatus: z.number().min(0).max(100),
  mileage: z.number().min(0),
  damageImages: z.array(z.string()),
  damageStatusDescription: z.string().optional(),
  scannerDescriptionImages: z.array(z.string()),
  scannerDescription: z.string().optional(),
  errorCodes: z.array(z.string()).optional(),
  carId: z.string(),
  cognitoId: z.string(),
  witnesses: z.array(z.string()).optional(),
  productInstalled: z.array(z.string()),
});

const updateReceiptBodySchema = z.object({
  id: z.string(),
  installationEndDate: z.date().optional(),
  signImage: z.string().optional(),
  installationStatus: z.enum(["pending", "completed"]).optional(),
  tankStatus: z.number().min(0).max(100).optional(),
  mileage: z.number().min(0).optional(),
  damageImages: z.array(z.string()).optional(),
  damageStatusDescription: z.string().optional(),
  scannerDescriptionImages: z.array(z.string()).optional(),
  scannerDescription: z.string().optional(),
  errorCodes: z.array(z.string()).optional(),
  carId: z.string().optional(),
  cognitoId: z.string().optional(),
  witnesses: z.array(z.string()).optional(),
  productInstalled: z.array(z.string()).optional(),
});

const removeReceiptBody = z.object({
  id: z.string(),
});

const getReceiptBody = z.object({
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
  const receiptRepository = new ReceiptRepository();
  const receiptService = new ReceiptService(receiptRepository);

  const receiptUseCases = new ReceiptUseCases(receiptService);

  try {
    switch (event.requestContext.http.method) {
      case GET:
        const receiptId = event.pathParameters?.receiptId;
        const download = event.queryStringParameters?.download;
        if (event.pathParameters) {
          const pathValidationResult = getReceiptBody.safeParse({
            id: event.pathParameters.receiptId,
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

          if (download) {
            // Generar y devolver el PDF
            const templateKey = "ORDEN-DE-SERVICIO-2024-CARTA.pdf"; // Reemplaza con la clave real de la plantilla
            const pdfBuffer = await receiptService.generatePdfFromTemplate(
              receiptId!,
              templateKey,
            );

            return {
              statusCode: HTTP_OK,
              headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": `attachment; filename="receipt-${receiptId}.pdf"`,
              },
              body: pdfBuffer.toString("base64"),
              isBase64Encoded: true,
            };
          } else {
            const receipt = await receiptUseCases.getReceipt(
              pathValidationResult.data.id,
            );
            return {
              statusCode: HTTP_OK,
              body: JSON.stringify(receipt),
            };
          }
        } else {
          const receipts = await receiptUseCases.findAllReceipts();
          return {
            statusCode: HTTP_OK,
            body: JSON.stringify(receipts),
          };
        }

      case POST: {
        const payload = JSON.parse(event.body ?? "{}");

        if (payload.installationEndDate) {
          payload.installationEndDate = new Date(payload.installationEndDate);
        } else {
          delete payload.installationEndDate;
        }

        const validationResult = createReceiptBodySchema.safeParse(payload);
        let newReceipt;
        if (validationResult.success) {
          newReceipt = await receiptUseCases.createReceipt(payload);
        } else {
          return {
            statusCode: HTTP_BAD_REQUEST,
            headers: { "Content-Type": "text/json" },

            body: JSON.stringify({
              message: "Invalid input data",
              errors: validationResult.error.issues,
            }),
          };
        }

        return {
          statusCode: HTTP_CREATED,
          body: JSON.stringify(newReceipt),
        };
      }

      case PATCH: {
        const payload = JSON.parse(event.body ?? "{}");
        let updatedReceipt;

        if (!event.pathParameters || !event.pathParameters.receiptId) {
          return {
            statusCode: HTTP_BAD_REQUEST,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              message: "Receipt ID is required in the path",
            }),
          };
        }

        if (payload.installationEndDate) {
          payload.installationEndDate = new Date(payload.installationEndDate);
        } else {
          delete payload.installationEndDate;
        }

        const validationResult = updateReceiptBodySchema.safeParse({
          ...payload,
          id: event.pathParameters.receiptId,
        });

        if (validationResult.success) {
          updatedReceipt = await receiptUseCases.updateReceipt(
            event.pathParameters.receiptId,
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
          body: JSON.stringify(updatedReceipt),
        };
      }

      case DELETE: {
        if (!event.pathParameters || !event.pathParameters.receiptId) {
          return {
            statusCode: HTTP_BAD_REQUEST,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              message: "Receipt ID is required in the path",
            }),
          };
        }

        const pathValidationResult = removeReceiptBody.safeParse({
          id: event.pathParameters.receiptId,
        });

        if (!pathValidationResult.success) {
          return {
            statusCode: HTTP_BAD_REQUEST,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              message: "Invalid or missing Receipt ID",
              errors: pathValidationResult.error.issues,
            }),
          };
        }

        const receiptId = pathValidationResult.data.id;

        try {
          await receiptUseCases.removeReceipt(receiptId);
          return {
            statusCode: HTTP_OK,
            body: JSON.stringify({
              id: receiptId,
              message: "Receipt removed successfully",
            }),
          };
        } catch (error) {
          return {
            statusCode: HTTP_INTERNAL_SERVER_ERROR,
            body: JSON.stringify({
              message: "An error occurred while removing the receipt",
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
