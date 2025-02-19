import { handler } from "../../src/infrastructure/web/routes/Receipt/handler";

handler(
  {
    httpMethod: "GET",
    pathParameters: {
      id: "",
    },
    headers: {
      headers: {
        idtoken: process.env.ID_TOKEN,
        Authorization: process.env.AUTHORIZATION,
      },
    },
  } as any,
  {} as any,
);
