import { handler } from "../../src/infrastructure/web/routes/Product/handler";

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
      name: "TopBoost",
      type: "GENERAL",
      description: "Test Description",
      sku: "SKU123",
      stock: 100,
      price: 50,
    }),
  } as any,
  {} as any,
);
