import { handler } from "../../src/infrastructure/web/routes/Receipt/handler";

handler(
  {
    pathParameters: {
      receiptId: "75b8da5b-96be-4bac-bcb1-79418b06974a",
    },
    headers: {
      idtoken: process.env.ID_TOKEN,
      Authorization: process.env.AUTHORIZATION,
    },
    requestContext: {
      http: {
        method: "PATCH",
      },
    },
    body: JSON.stringify({
      carId: "50be6810-1064-4cef-964b-ce2c99398829",
    }),
  } as any,
  {} as any,
);
