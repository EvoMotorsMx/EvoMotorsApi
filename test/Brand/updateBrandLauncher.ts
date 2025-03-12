import { handler } from "../../src/infrastructure/web/routes/Brand/handler";

handler(
  {
    httpMethod: "PUT",
    pathParameters: {
      id: "",
    },
    headers: {
      idtoken: process.env.ID_TOKEN,
      Authorization: process.env.AUTHORIZATION,
    },
    body: JSON.stringify({
      name: "AUDI",
    }),
  } as any,
  {} as any,
);
