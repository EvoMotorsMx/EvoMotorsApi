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
        method: "GET",
      },
    },
  } as any,
  {} as any,
);
