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
      name: "",
      totalQuantity: 2,
      description: "",
    }),
  } as any,
  {} as any,
);
