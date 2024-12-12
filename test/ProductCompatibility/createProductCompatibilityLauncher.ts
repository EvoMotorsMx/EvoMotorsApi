import { handler } from "../../src/infrastructure/web/routes/Tool/handler";

handler(
  {
    requestContext: {
      http: {
        method: "POST",
      },
    },
    headers: {
      IdToken: "",
      Authorization: "",
    },
    body: JSON.stringify({
      productId: "",
      carModelId: "",
    }),
  } as any,
  {} as any,
);
