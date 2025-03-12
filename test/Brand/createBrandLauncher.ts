import { handler } from "../../src/infrastructure/web/routes/Brand/handler";

handler(
  {
    requestContext: {
      http: {
        method: "POST",
      },
    },
    headers: {
      idtoken: process.env.ID_TOKEN,
      Authorization: process.env.AUTHORIZATION,
    },
    body: JSON.stringify({
      name: "TOYOTA",
    }),
  } as any,
  {} as any,
);
