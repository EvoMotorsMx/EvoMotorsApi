import { handler } from "../../src/infrastructure/web/routes/ProductGroup/handler";

handler(
  {
    pathParameters: {
      productBrandId: "4f05e458-2476-4bb2-addc-fae54f22299e",
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
      name: "SPORTDRIVE TECHNOLOGY",
    }),
  } as any,
  {} as any,
);
