import { handler } from "../../src/infrastructure/web/routes/ProductPrice/handler";

handler(
  {
    requestContext: {
      http: {
        method: "POST",
      },
    },
    headers: {
      idtoken: "",
      Authorization: "",
    },
    body: JSON.stringify({
      carModelId: "6b6db388-40a1-4e98-8692-b7a52ebd9cbc",
      productId: "6709095a-d656-4b4b-a54f-6d33bf10c695",
      price: 19950,
      hpIncrement: 35,
      torqueIncrement: 44,
    }),
  } as any,
  {} as any,
);
