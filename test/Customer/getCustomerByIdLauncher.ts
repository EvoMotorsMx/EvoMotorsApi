import { handler } from "../../src/infrastructure/web/routes/Customer/handler";

handler(
  {
    pathParameters: {
      customerId: "",
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
