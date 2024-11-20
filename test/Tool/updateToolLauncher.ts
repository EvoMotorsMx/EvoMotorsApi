import { handler } from "../../src/infrastructure/web/routes/Tool/handler";

handler(
  {
    pathParameters: {
      carModelId: "",
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
    body: JSON.stringify({ name: "" }),
  } as any,
  {} as any,
);
