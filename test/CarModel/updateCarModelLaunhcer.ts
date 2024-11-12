import { handler } from "../../src/infrastructure/web/routes/CarModel/handler";

handler(
  {
    pathParameters: {
      carModelId: "6b6db388-40a1-4e98-8692-b7a52ebd9cbc",
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
      products: ["6709095a-d656-4b4b-a54f-6d33bf10c695"],
    }),
  } as any,
  {} as any,
);
