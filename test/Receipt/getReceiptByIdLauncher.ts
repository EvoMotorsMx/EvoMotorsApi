import { handler } from "../../src/infrastructure/web/routes/Receipt/handler";

handler(
  {
    requestContext: {
      http: {
        method: "GET",
      },
    },
    pathParameters: {
      receiptId: "75b8da5b-96be-4bac-bcb1-79418b06974a", // Reemplaza con el ID del recibo que deseas descargar
    },
    headers: {
      idtoken: process.env.ID_TOKEN,
      Authorization: process.env.AUTHORIZATION,
    },
  } as any,
  {} as any,
);
