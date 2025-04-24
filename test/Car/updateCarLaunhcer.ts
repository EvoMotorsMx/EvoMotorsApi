import { handler } from "../../src/infrastructure/web/routes/Car/handler";

handler(
  {
    pathParameters: {
      carId: "50be6810-1064-4cef-964b-ce2c99398829",
    },
    headers: {
      idtoken: process.env.ID_TOKEN,
      Authorization: process.env.AUTHORIZATION,
    },
    requestContext: {
      http: {
        method: "PATCH",
      },
    },
    body: JSON.stringify({
      year: 2024,
      transmissionType: "Auto",
    }),
  } as any,
  {} as any,
);
