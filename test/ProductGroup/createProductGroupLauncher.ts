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
      name: "RACECHIP CHIP TUNING",
      productBrandId: "c5ec2731-1a32-47c4-a691-3e50ea5fc817",
    }),
  } as any,
  {} as any,
);
