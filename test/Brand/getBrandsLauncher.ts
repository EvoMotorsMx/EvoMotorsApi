import { handler } from "../../src/infrastructure/web/routes/Brand/handler";

handler(
  {
    requestContext: {
      http: {
        method: "GET",
      },
    },
    headers: {
      idtoken: process.env.ID_TOKEN,
      Authorization: process.env.AUTHORIZATION,
    },
  } as any,
  {} as any,
);
