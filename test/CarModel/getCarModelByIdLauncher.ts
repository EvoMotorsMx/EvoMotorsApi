import { handler } from "../../src/infrastructure/web/routes/CarModel/handler";

handler(
  {
    httpMethod: "GET",
    pathParameters: {
      id: "",
    },
    headers: {
      idtoken: process.env.ID_TOKEN,
      Authorization: process.env.AUTHORIZATION,
    },
  } as any,
  {} as any,
);
