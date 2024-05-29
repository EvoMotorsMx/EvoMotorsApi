import { handler } from "../../src/infrastructure/web/routes/Brand/handler";

handler(
  {
    requestContext: {
      http: {
        method: "POST",
      },
    },
    headers: {
      idtoken: "",
      Authorization: "",
    },
    body: JSON.stringify({
      name: "TOYOTA",
    }),
  } as any,
  {} as any,
);
