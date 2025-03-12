import { handler } from "../../src/infrastructure/web/routes/Car/handler";

handler(
  {
    httpMethod: "DELETE",
    pathParameters: {
      carId: "9b5bd193-8004-47e9-9940-d23dc502ca35",
    },
    headers: {
      idtoken: process.env.ID_TOKEN,
      Authorization: process.env.AUTHORIZATION,
    },
    requestContext: {
      http: {
        method: "DELETE",
      },
    },
  } as any,
  {} as any,
);
