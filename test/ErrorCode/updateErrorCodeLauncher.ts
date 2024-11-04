import { handler } from "../../src/infrastructure/web/routes/ProductPrice/handler";

handler(
  {
    pathParameters: {
      errorCodeId: "",
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
    body: JSON.stringify({}),
  } as any,
  {} as any,
);
