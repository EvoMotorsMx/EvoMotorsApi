import {
  APIGatewayProxyEventV2,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";
import { connectToDatabase } from "../../../../shared/utils/db-connection";
import { CertificateService } from "../../../../core/domain/services/CertificateService";
import { CertificateUseCases } from "../../../../core/application/use_cases/CertificateUseCases";
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
import { CertificateRepository } from "../../../persistence/repositories/CertificateRepository";
import { decodeToken } from "../../../../shared/utils/userDecoder";
import { CUSTOMER_ROLE } from "../../../../shared/constants/roles";
import { IIdToken } from "../../../security/Auth";


const createCertificateBodySchema = z.object({
  name: z.string(),
  _id: z.string().optional(),
  date: z.number().optional(),
  folio: z.number().optional(),
  brand: z.string().optional(),
  modelo: z.string().optional(),
  year: z.number().optional(),
  engine: z.number().optional(),
  vim: z.string().optional(),
  mileage: z.number().optional(),
});

const updateCertificateBodySchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  date: z.number().optional(),
  folio: z.number().optional(),
  brand: z.string().optional(),
  modelo: z.string().optional(),
  year: z.number().optional(),
  engine: z.number().optional(),
  vim: z.string().optional(),
  mileage: z.number().optional(),
});

const removeCertificateBody = z.object({
  id: z.string(),
});

const getCertificateBody = z.object({
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
  const certificateRepository = new CertificateRepository();
  const certificateService = new CertificateService(certificateRepository);
  const certificateUseCases = new CertificateUseCases(certificateService);

  try {
    switch (event.requestContext.http.method) {
      case GET:
        if (event.pathParameters) {
          const pathValidationResult = getCertificateBody.safeParse({
            id: event.pathParameters.certificateId,
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

          const certificates = await certificateUseCases.getCertificate(
            pathValidationResult.data.id,
          );
          return {
            statusCode: HTTP_OK,
            body: JSON.stringify(certificates),
          };
        } else {
          const certificates = await certificateUseCases.findAllCertificates();
          return {
            statusCode: HTTP_OK,
            body: JSON.stringify(certificates),
          };
        }

      case POST: {
        const payload = JSON.parse(event.body ?? "{}");
        const validationResult = createCertificateBodySchema.safeParse(payload);
        let newCertificate;
        if (validationResult.success) {
          newCertificate = await certificateUseCases.createCertificate(payload);
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
          body: JSON.stringify(newCertificate),
        };
      }

      case PATCH: {
        const payload = JSON.parse(event.body ?? "{}");
        let updatedCertificate;

        if (!event.pathParameters || !event.pathParameters.certificateId) {
          return {
            statusCode: HTTP_BAD_REQUEST,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              message: "Certificate ID is required in the path",
            }),
          };
        }

        const validationResult = updateCertificateBodySchema.safeParse({
          ...payload,
          id: event.pathParameters.certificateId,
        });

        if (validationResult.success) {
          updatedCertificate = await certificateUseCases.updateCertificate(
            event.pathParameters.certificateId,
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
          body: JSON.stringify(updatedCertificate),
        };
      }

      case DELETE: {
        if (!event.pathParameters || !event.pathParameters.certificateId) {
          return {
            statusCode: HTTP_BAD_REQUEST,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              message: "Certificate ID is required in the path",
            }),
          };
        }

        const pathValidationResult = removeCertificateBody.safeParse({
          id: event.pathParameters.certificateId,
        });

        if (!pathValidationResult.success) {
          return {
            statusCode: HTTP_BAD_REQUEST,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              message: "Invalid or missing Certificate ID",
              errors: pathValidationResult.error.issues,
            }),
          };
        }

        const certificateId = pathValidationResult.data.id;

        try {
          await certificateUseCases.removeCertificate(certificateId);
          return {
            statusCode: HTTP_OK,
            body: JSON.stringify({
              id: certificateId,
              message: "Certificate removed successfully",
            }),
          };
        } catch (error) {
          return {
            statusCode: HTTP_INTERNAL_SERVER_ERROR,
            body: JSON.stringify({
              message: "An error occurred while removing the certificate",
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
