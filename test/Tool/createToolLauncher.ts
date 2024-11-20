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
      name: "",
      totalQuantity: 2,
      description: "",
    }),
  } as any,
  {} as any,
);
