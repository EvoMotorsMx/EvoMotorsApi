import { handler } from "../../src/infrastructure/web/routes/User/handler";

handler(
  {
    pathParameters: {
      userId: "",
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