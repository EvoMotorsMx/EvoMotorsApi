import { handler } from "../../src/infrastructure/web/routes/User/handler";

handler(
  {
    pathParameters: {
      userId: "",
    },
    headers: {
      idtoken: process.env.ID_TOKEN,
      Authorization: process.env.AUTHORIZATION,
    },
    requestContext: {
      http: {
        method: "GET",
      },
    },
  } as any,
  {} as any,
);
