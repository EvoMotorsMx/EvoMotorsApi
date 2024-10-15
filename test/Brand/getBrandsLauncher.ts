import { handler } from "../../src/infrastructure/web/routes/Brand/handler";

handler(
  {
    requestContext: {
      http: {
        method: "GET",
      },
    },
    headers: {
      idtoken: "",
      Authorization: "",
    },
  } as any,
  {} as any,
);
