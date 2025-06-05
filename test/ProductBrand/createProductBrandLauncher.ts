import { handler } from "../../src/infrastructure/web/routes/ProductBrand/handler";

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
      name: "RACECHIP",
    }),
  } as any,
  {} as any,
);
