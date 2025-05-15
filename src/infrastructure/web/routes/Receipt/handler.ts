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
import { S3Service } from "../../../storage/s3.service";
import {
  CreateReceiptDTO,
  UpdateReceiptDTO,
} from "../../../../core/application/dtos";
import { processFormData } from "../../../../shared/utils/formDataProcessor";
import { generateHash } from "../../../../shared/utils/generateHash";

const createReceiptBodySchema = z.object({
  installationEndDate: z.string().optional(),
  installationStatus: z.enum(["pending", "completed"]),
  tankStatus: z.number().min(0).max(100),
  mileage: z.number().min(0),
  damageImage: z.object({
    s3Url: z.string(),
    timestamp: z.date(),
    hash: z.string(),
  }),
  scannerDescriptionImages: z.array(z.string()),
  cognitoId: z.string(),
  carId: z.string(),
  witnesses: z.array(z.string()).optional(),
  productInstalled: z.array(z.string()),
  signatureData: z.object({
    s3Url: z.string(),
    timestamp: z.date(),
    hash: z.string(),
  }),
});
const updateReceiptBodySchema = z.object({
  id: z.string(),
  installationEndDate: z.string().optional(),
  installationStatus: z.enum(["pending", "completed"]).optional(),
  tankStatus: z.number().min(0).max(100).optional(),
  mileage: z.number().min(0).optional(),
  damageImage: z
    .object({
      s3Url: z.string(),
      timestamp: z.date(),
      hash: z.string(),
    })
    .optional(),
  scannerDescriptionImages: z.array(z.string()).optional(),
  cognitoId: z.string().optional(),
  carId: z.string().optional(),
  witnesses: z.array(z.string()).optional(),
  productInstalled: z.array(z.string()).optional(),
  signatureData: z
    .object({
      s3Url: z.string().optional(),
      timestamp: z.date().optional(),
      hash: z.string().optional(),
    })
    .optional(),
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
          console.log("Path parameters: ", event.pathParameters);
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
            console.log("Fetching receipt...");
            const receipt = await receiptUseCases.getReceipt(
              pathValidationResult.data.id,
            );
            console.log("Receipt fetched successfully.");
            return {
              statusCode: HTTP_OK,
              body: JSON.stringify(receipt),
            };
          }
        } else {
          console.log("Fetching receipts...");
          const receipts = await receiptUseCases.findAllReceipts();
          console.log("Receipts fetched successfully.");
          return {
            statusCode: HTTP_OK,
            body: JSON.stringify(receipts),
          };
        }

      case POST: {
        if (
          event.requestContext.http.method === "POST" &&
          event.requestContext.http.path === "/receipt"
        ) {
          if (!event.isBase64Encoded) {
            return {
              statusCode: HTTP_BAD_REQUEST,
              body: JSON.stringify({
                message: "Request body must be Base64 encoded",
              }),
            };
          }
        }

        const { fields, files } = await processFormData(event);

        // Subir archivos a S3
        const uploadedFiles = await Promise.all(
          files.map(async (file) => {
            const s3Url = await S3Service.uploadImage(
              file.buffer,
              "uploads",
              file.filename,
              file.contentType,
            );

            const hash = generateHash(file.buffer);

            return {
              fieldname: file.fieldname,
              s3Url,
              timestamp: new Date(),
              hash,
            };
          }),
        );

        // Asociar URLs de S3 con los datos de entrada
        const receiptData: CreateReceiptDTO = {
          installationStatus: fields.installationStatus as
            | "pending"
            | "completed",
          tankStatus: Number(fields.tankStatus),
          mileage: Number(fields.mileage),
          scannerDescriptionImages: fields.scannerDescriptionImages
            ? JSON.parse(fields.scannerDescriptionImages)
            : [],
          cognitoId: fields.cognitoId,
          carId: fields.carId,
          productInstalled: fields.productInstalled
            ? JSON.parse(fields.productInstalled)
            : [],
          damageImage: uploadedFiles.find(
            (file) => file.fieldname === "damageImage",
          ) || { s3Url: "", timestamp: new Date(), hash: "" },
          signatureData: uploadedFiles.find(
            (file) => file.fieldname === "signatureData",
          ) || { s3Url: "", timestamp: new Date(), hash: "" },
          witnesses: fields.witnesses
            ? JSON.parse(fields.witnesses)
            : undefined,
          installationEndDate: fields.installationEndDate
            ? new Date(fields.installationEndDate)
            : undefined,
        };

        // Validar los datos
        const validationResult = createReceiptBodySchema.safeParse(receiptData);
        if (!validationResult.success) {
          return {
            statusCode: HTTP_BAD_REQUEST,
            body: JSON.stringify({
              message: "Invalid input data",
              errors: validationResult.error.issues,
            }),
          };
        }

        // Guardar el recibo
        const newReceipt = await receiptUseCases.createReceipt(receiptData);

        return {
          statusCode: HTTP_CREATED,
          body: JSON.stringify(newReceipt),
        };
      }

      case PATCH: {
        const receiptId = event.pathParameters?.receiptId;
        if (!receiptId) {
          return {
            statusCode: HTTP_BAD_REQUEST,
            body: JSON.stringify({
              message: "Receipt ID is required in the path",
            }),
          };
        }

        if (
          event.requestContext.http.method === "PATCH" &&
          event.requestContext.http.path === "/receipt"
        ) {
          if (!event.isBase64Encoded) {
            return {
              statusCode: HTTP_BAD_REQUEST,
              body: JSON.stringify({
                message: "Request body must be Base64 encoded",
              }),
            };
          }
        }

        const { fields, files } = await processFormData(event);

        // Subir archivos a S3
        const uploadedFiles = await Promise.all(
          files.map(async (file) => {
            const s3Url = await S3Service.uploadImage(
              file.buffer,
              "uploads",
              file.filename,
              file.contentType,
            );

            const hash = generateHash(file.buffer);

            return {
              fieldname: file.fieldname,
              s3Url,
              timestamp: new Date(),
              hash,
            };
          }),
        );

        // Combinar los datos existentes con los nuevos
        const updatedData = {
          ...fields, // Solo sobrescribe los campos proporcionados
        };

        // Validar los datos combinados
        const validationResult = updateReceiptBodySchema.safeParse({
          ...updatedData,
          id: receiptId,
        });

        if (!validationResult.success) {
          return {
            statusCode: HTTP_BAD_REQUEST,
            body: JSON.stringify({
              message: "Invalid input data",
              errors: validationResult.error.issues,
            }),
          };
        }

        // Actualizar el recibo
        const updatedReceipt = await receiptUseCases.updateReceipt(
          receiptId,
          updatedData,
        );

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
