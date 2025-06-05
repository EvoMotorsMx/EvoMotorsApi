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
      name: "DM-B8222",
      type: "CABLE",
      description: "",
      productGroupId: "e0feb036-e229-4331-95fc-f9d8343e1ff1",
      sku: "",
      isComplement: true,
      price: 50,
    }),
  } as any,
  {} as any,
);
