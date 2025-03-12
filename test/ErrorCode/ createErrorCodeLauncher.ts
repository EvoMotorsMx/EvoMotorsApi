import { handler } from "../../src/infrastructure/web/routes/ProductPrice/handler";

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
      name: "Injector",
      code: "P000",
      description: "Test Error",
      brand: "dc10bea8-0ae9-471e-91d5-18df8c16448f",
    }),
  } as any,
  {} as any,
);
