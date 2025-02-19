import { handler } from "../../src/infrastructure/web/routes/Tool/handler";

handler(
  {
    pathParameters: {
      productCompatibilityId: "",
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
    body: JSON.stringify({ productId: "", carModelId: "" }),
  } as any,
  {} as any,
);
