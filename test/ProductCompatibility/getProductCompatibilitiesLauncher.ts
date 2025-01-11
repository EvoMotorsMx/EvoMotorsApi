import { handler } from "../../src/infrastructure/web/routes/ProductCompatibility/handler";

handler(
  {
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
