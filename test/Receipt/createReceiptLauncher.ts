import { handler } from "../../src/infrastructure/web/routes/Receipt/handler";

handler(
  {
    requestContext: {
      http: {
        method: "POST",
      },
    },
    headers: {
      headers: {
        idtoken: process.env.ID_TOKEN,
        Authorization: process.env.AUTHORIZATION,
      },
    },
    body: JSON.stringify({
      name: "A1",
      brandId: "dc10bea8-0ae9-471e-91d5-18df8c16448f",
      year: ["2019", "2020"],
      engineSize: "2.0",
      cylinder: 4,
      combustion: "Gasolina",
      engineType: "Turbo",
      files: [],
    }),
  } as any,
  {} as any,
);
