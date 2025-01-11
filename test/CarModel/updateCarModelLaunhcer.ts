import { handler } from "../../src/infrastructure/web/routes/CarModel/handler";

handler(
  {
    pathParameters: {
      carModelId: "",
    },
    headers: {
      idtoken: "",
      Authorization: "",
    },
    requestContext: {
      http: {
        method: "PATCH",
      },
    },
    body: JSON.stringify({
      products: [""],
    }),
  } as any,
  {} as any,
);
