import { handler } from "../../src/infrastructure/web/routes/Tool/handler";

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
      productId: "",
      carModelId: "",
    }),
  } as any,
  {} as any,
);
