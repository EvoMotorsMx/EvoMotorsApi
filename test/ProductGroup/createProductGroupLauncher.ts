import { handler } from "../../src/infrastructure/web/routes/ProductGroup/handler";

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
      name: "TOPBOOST PRO",
      productBrandId: "66e3340e-327e-4235-b04b-a5877506fafc",
    }),
  } as any,
  {} as any,
);
