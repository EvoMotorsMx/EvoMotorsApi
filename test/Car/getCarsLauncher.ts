import { handler } from "../../src/infrastructure/web/routes/Car/handler";

handler(
  {
    httpMethod: "GET",
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
