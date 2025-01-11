import { handler } from "../../src/infrastructure/web/routes/CarModel/handler";

handler(
  {
    httpMethod: "GET",
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
