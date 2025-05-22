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
      name: "Test Product",
      type: "Type1",
      description: "Test Description",
      sku: "SKU123",
      systemType: "SystemType1",
      stock: 100,
      price: 50,
    }),
  } as any,
  {} as any,
);
