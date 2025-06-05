import { handler } from "../../src/infrastructure/web/routes/ProductCompatibility/handler";

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
      productId: "e75dcbf0-ab41-4970-a584-98507e1b6443",
      carModelId: "eff2852f-f759-4a65-8bc4-d235bcdbf173",
      endHp: 44,
      endTorque: 54,
      vMax: "NO APLICA",
      priceOverride: 21350,
      priceAdditional: 0,
      complementId: "7a2bcb02-5b17-44dc-88b1-580c9d4703e3",
    }),
  } as any,
  {} as any,
);
