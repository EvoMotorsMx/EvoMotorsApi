import { handler } from "../../src/infrastructure/web/routes/Product/handler";

handler(
  {
    pathParameters: {
      carModelId: "",
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
