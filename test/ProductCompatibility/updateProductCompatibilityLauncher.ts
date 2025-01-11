import { handler } from "../../src/infrastructure/web/routes/Tool/handler";

handler(
  {
    pathParameters: {
      productCompatibilityId: "",
    },
    headers: {
      idtoken: "",
      Authorization: "",
    },
    requestContext: {
      http: {
        method: "PATCH",
      },
    },
    body: JSON.stringify({ productId: "", carModelId: "" }),
  } as any,
  {} as any,
);
