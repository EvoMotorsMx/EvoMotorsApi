import { handler } from "../../src/infrastructure/web/routes/ProductCompatibility/handler";

handler(
  {
    requestContext: {
      http: {
        method: "POST",
      },
    },
    headers: {
      idtoken: process.env.ID_TOKEN,
      Authorization: process.env.AUTHORIZATION,
    },
    body: JSON.stringify({
      productId: "8967f9e1-8951-4db4-a19c-1897f9772fd9",
      carModelId: "89bbf601-bc0a-432e-9e62-75ef67b7fb6f",
    }),
  } as any,
  {} as any,
);
