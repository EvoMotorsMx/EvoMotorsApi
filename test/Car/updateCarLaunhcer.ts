import { handler } from "../../src/infrastructure/web/routes/Car/handler";

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
        method: "PATCH",
      },
    },
    body: JSON.stringify({
      cars: ["78121081-67d9-4b2f-885d-44f9606f9828"],
    }),
  } as any,
  {} as any,
);
